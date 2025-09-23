import { serve } from "std/http/server.ts"
import { createClient } from "supabase/"
import { corsHeaders } from "../_shared/cors.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile and check admin permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, district')
      .eq('id', user.id)
      .single()

    if (!profile || !['district_admin', 'state_admin', 'super_admin'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Admin privileges required' }), 
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const action = url.searchParams.get('action')
      const district = url.searchParams.get('district')
      const state = url.searchParams.get('state')

      // Apply district restriction for district admins
      const districtFilter = profile.role === 'district_admin' ? profile.district : district

      if (action === 'dashboard') {
        // Get dashboard statistics
        let claimsQuery = supabase
          .from('fra_claims')
          .select('*')

        if (districtFilter) {
          claimsQuery = claimsQuery.eq('district', districtFilter)
        }
        if (state) {
          claimsQuery = claimsQuery.eq('state', state)
        }

        const [
          { data: claims },
          { data: assets },
          { data: recommendations },
          { data: users }
        ] = await Promise.all([
          claimsQuery,
          supabase
            .from('asset_maps')
            .select('*')
            .then(({ data, error }) => ({ data: data || [], error })),
          supabase
            .from('scheme_recommendations')
            .select('*')
            .then(({ data, error }) => ({ data: data || [], error })),
          supabase
            .from('profiles')
            .select('*')
            .then(({ data, error }) => ({ data: data || [], error }))
        ])

        // Calculate statistics
        const stats = {
          totalClaims: claims?.length || 0,
          pendingClaims: claims?.filter(c => c.status === 'pending').length || 0,
          approvedClaims: claims?.filter(c => c.status === 'approved').length || 0,
          rejectedClaims: claims?.filter(c => c.status === 'rejected').length || 0,
          totalAssets: assets?.length || 0,
          totalUsers: users?.length || 0,
          totalRecommendations: recommendations?.length || 0,
          claimsByType: {
            IFR: claims?.filter(c => c.claim_type === 'IFR').length || 0,
            CR: claims?.filter(c => c.claim_type === 'CR').length || 0,
            CFR: claims?.filter(c => c.claim_type === 'CFR').length || 0
          },
          assetsByType: {
            agriculture: assets?.filter(a => a.asset_type === 'agriculture').length || 0,
            forest: assets?.filter(a => a.asset_type === 'forest').length || 0,
            water_body: assets?.filter(a => a.asset_type === 'water_body').length || 0,
            homestead: assets?.filter(a => a.asset_type === 'homestead').length || 0
          },
          totalAreaClaimed: claims?.reduce((sum, claim) => sum + (claim.area_hectares || 0), 0) || 0
        }

        // Get recent activities
        const { data: logs } = await supabase
          .from('logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10)

        return new Response(
          JSON.stringify({ stats, recentActivities: logs || [] }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (action === 'claims') {
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '20')
        const status = url.searchParams.get('status')
        const offset = (page - 1) * limit

        let query = supabase
          .from('fra_claims')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)

        if (districtFilter) {
          query = query.eq('district', districtFilter)
        }
        if (state) {
          query = query.eq('state', state)
        }
        if (status) {
          query = query.eq('status', status)
        }

        const { data: claims, error } = await query
          .order('submitted_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to fetch claims' }), 
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ claims, page, limit }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (action === 'villages') {
        let query = supabase
          .from('fra_claims')
          .select('village_name, district, state, status')

        if (districtFilter) {
          query = query.eq('district', districtFilter)
        }
        if (state) {
          query = query.eq('state', state)
        }

        const { data: claims } = await query

        // Group by village
        const villageStats: Record<string, any> = {}

        claims?.forEach(claim => {
          const key = `${claim.village_name}-${claim.district}`
          if (!villageStats[key]) {
            villageStats[key] = {
              villageName: claim.village_name,
              district: claim.district,
              state: claim.state,
              totalClaims: 0,
              pendingClaims: 0,
              approvedClaims: 0,
              rejectedClaims: 0
            }
          }
          villageStats[key].totalClaims++
          if (claim.status === 'pending') villageStats[key].pendingClaims++
          if (claim.status === 'approved') villageStats[key].approvedClaims++
          if (claim.status === 'rejected') villageStats[key].rejectedClaims++
        })

        return new Response(
          JSON.stringify({ villages: Object.values(villageStats) }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'PUT') {
      // Handle claim approval/rejection
      const body = await req.json()
      const { claimId, status, adminNotes } = body

      if (!claimId || !status || !['approved', 'rejected'].includes(status)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request data' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get the claim to check district access
      const { data: claim } = await supabase
        .from('fra_claims')
        .select('*')
        .eq('id', claimId)
        .single()

      if (!claim) {
        return new Response(
          JSON.stringify({ error: 'Claim not found' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Check district access for district admins
      if (profile.role === 'district_admin' && profile.district !== claim.district) {
        return new Response(
          JSON.stringify({ error: 'Access denied - district mismatch' }), 
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Update claim status
      const { data: updatedClaim, error } = await supabase
        .from('fra_claims')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: user.id,
          metadata_json: {
            ...claim.metadata_json,
            adminNotes: adminNotes || null
          }
        })
        .eq('id', claimId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update claim' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Log the action
      await supabase
        .from('logs')
        .insert({
          user_id: user.id,
          action: `claim_${status}`,
          metadata: {
            claim_id: claimId,
            previous_status: claim.status,
            new_status: status,
            admin_notes: adminNotes
          }
        })

      return new Response(
        JSON.stringify({ success: true, claim: updatedClaim }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { action } = body

      if (action === 'bulk-process') {
        const { claimIds, status, adminNotes } = body

        if (!claimIds || !Array.isArray(claimIds) || !status) {
          return new Response(
            JSON.stringify({ error: 'Invalid request data' }), 
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        let processed = 0
        let failed = 0

        for (const claimId of claimIds) {
          try {
            const { data: claim } = await supabase
              .from('fra_claims')
              .select('*')
              .eq('id', claimId)
              .single()

            if (claim && (profile.role !== 'district_admin' || profile.district === claim.district)) {
              await supabase
                .from('fra_claims')
                .update({
                  status,
                  approved_at: status === 'approved' ? new Date().toISOString() : null,
                  approved_by: user.id,
                  metadata_json: {
                    ...claim.metadata_json,
                    adminNotes: adminNotes || null
                  }
                })
                .eq('id', claimId)

              processed++
            } else {
              failed++
            }
          } catch (error) {
            console.error(`Failed to process claim ${claimId}:`, error)
            failed++
          }
        }

        // Log the bulk action
        await supabase
          .from('logs')
          .insert({
            user_id: user.id,
            action: `bulk_${status}`,
            metadata: {
              processed,
              failed,
              total_claims: claimIds.length
            }
          })

        return new Response(
          JSON.stringify({ processed, failed, total: claimIds.length }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

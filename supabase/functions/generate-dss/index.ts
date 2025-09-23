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

// Government schemes database (simplified version for Edge Function)
const GOVERNMENT_SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support scheme providing ₹6,000 per year to eligible farmer families',
    category: 'agriculture'
  },
  {
    id: 'jal-jeevan-mission', 
    name: 'Jal Jeevan Mission',
    description: 'Aims to provide safe and adequate drinking water through individual household tap connections',
    category: 'infrastructure'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)', 
    description: 'Guarantees 100 days of employment per rural household per year',
    category: 'livelihood'
  },
  {
    id: 'forest-rights-act',
    name: 'Forest Rights Act Implementation Support',
    description: 'Support for implementation of community forest rights and livelihood activities',
    category: 'forest'
  }
]

function generateRecommendations(claim: any, assets: any[]) {
  const recommendations: any[] = []

  for (const scheme of GOVERNMENT_SCHEMES) {
    let score = 0.0
    let reasoning: string[] = []
    let eligibilityMatch = false

    switch (scheme.id) {
      case 'pm-kisan':
        if (claim.area_hectares <= 2.0) {
          score += 0.8
          eligibilityMatch = true
          reasoning.push('Land area is within 2 hectares limit')
        }
        if (assets.some((a: any) => a.asset_type === 'agriculture')) {
          score += 0.3
          reasoning.push('Agricultural land detected in asset mapping')
        }
        break

      case 'jal-jeevan-mission':
        if (!assets.some((a: any) => a.asset_type === 'water_body')) {
          score += 0.6
          eligibilityMatch = true
          reasoning.push('No significant water bodies detected - may need water infrastructure')
        }
        break

      case 'mgnrega':
        score += 0.7 // Always relevant for rural households
        eligibilityMatch = true
        reasoning.push('Universal rural employment scheme')
        if (claim.area_hectares < 1.0) {
          score += 0.2
          reasoning.push('Small landholders often need additional income sources')
        }
        break

      case 'forest-rights-act':
        if (claim.claim_type === 'CFR') {
          score += 0.9
          eligibilityMatch = true
          reasoning.push('Community Forest Rights claim - highly relevant')
        } else if (claim.claim_type === 'IFR') {
          score += 0.7
          eligibilityMatch = true
          reasoning.push('Individual Forest Rights claim - relevant for implementation support')
        }
        break
    }

    // Only include relevant schemes
    if (score > 0.3) {
      let priority: 'high' | 'medium' | 'low'
      if (eligibilityMatch && score >= 0.8) {
        priority = 'high'
      } else if (eligibilityMatch && score >= 0.5) {
        priority = 'medium'
      } else if (score >= 0.7) {
        priority = 'medium'
      } else {
        priority = 'low'
      }

      recommendations.push({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        relevance_score: Math.min(score, 1.0),
        eligibility_match: eligibilityMatch,
        reasoning: reasoning.join('; '),
        priority
      })
    }
  }

  return recommendations.sort((a, b) => b.relevance_score - a.relevance_score)
}

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

    if (req.method === 'POST') {
      const { claimId } = await req.json()

      if (!claimId) {
        return new Response(
          JSON.stringify({ error: 'Claim ID is required' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get claim details
      const { data: claim, error: claimError } = await supabase
        .from('fra_claims')
        .select('*')
        .eq('id', claimId)
        .single()

      if (claimError || !claim) {
        return new Response(
          JSON.stringify({ error: 'Claim not found' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Check if user can access this claim
      if (claim.user_id !== user.id) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, district')
          .eq('id', user.id)
          .single()

        const isAdmin = profile && ['district_admin', 'state_admin', 'super_admin'].includes(profile.role)
        const hasDistrictAccess = profile?.role === 'district_admin' ? profile.district === claim.district : true

        if (!isAdmin || !hasDistrictAccess) {
          return new Response(
            JSON.stringify({ error: 'Access denied' }), 
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      }

      // Get related assets
      const { data: assets } = await supabase
        .from('asset_maps')
        .select('*')
        .eq('village_name', claim.village_name)
        .eq('district', claim.district)

      // Generate recommendations
      const recommendations = generateRecommendations(claim, assets || [])

      // Save recommendations to database
      const { error: saveError } = await supabase
        .from('scheme_recommendations')
        .upsert(
          {
            fra_claim_id: claimId,
            recommended_schemes: recommendations,
            engine_version: 'v1.0.0'
          },
          { onConflict: 'fra_claim_id' }
        )

      if (saveError) {
        console.error('Failed to save recommendations:', saveError)
      }

      // Log the action
      await supabase
        .from('logs')
        .insert({
          user_id: user.id,
          action: 'generate_dss_recommendations',
          metadata: {
            claim_id: claimId,
            recommendations_count: recommendations.length
          }
        })

      // Count priorities
      const highPriorityCount = recommendations.filter(r => r.priority === 'high').length
      const mediumPriorityCount = recommendations.filter(r => r.priority === 'medium').length
      const lowPriorityCount = recommendations.filter(r => r.priority === 'low').length

      return new Response(
        JSON.stringify({
          claimId,
          recommendations,
          totalSchemes: recommendations.length,
          highPriorityCount,
          mediumPriorityCount,
          lowPriorityCount,
          generatedAt: new Date().toISOString(),
          engineVersion: 'v1.0.0'
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const claimId = url.searchParams.get('claimId')

      if (!claimId) {
        return new Response(
          JSON.stringify({ error: 'Claim ID is required' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get existing recommendations
      const { data, error } = await supabase
        .from('scheme_recommendations')
        .select('*')
        .eq('fra_claim_id', claimId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'No recommendations found' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const recommendations = data.recommended_schemes
      const highPriorityCount = recommendations.filter((r: any) => r.priority === 'high').length
      const mediumPriorityCount = recommendations.filter((r: any) => r.priority === 'medium').length
      const lowPriorityCount = recommendations.filter((r: any) => r.priority === 'low').length

      return new Response(
        JSON.stringify({
          claimId,
          recommendations,
          totalSchemes: recommendations.length,
          highPriorityCount,
          mediumPriorityCount,
          lowPriorityCount,
          generatedAt: data.generated_at,
          engineVersion: data.engine_version
        }), 
        { 
          status: 200, 
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
    console.error('DSS generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

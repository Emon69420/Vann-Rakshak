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

// Mock AI asset detection function
function mockAssetDetection(coordinates: number[]): any[] {
  const [minLon, minLat, maxLon, maxLat] = coordinates
  const centerLon = (minLon + maxLon) / 2
  const centerLat = (minLat + maxLat) / 2

  return [
    {
      type: 'agriculture',
      confidence: 0.92,
      area: 1.2,
      coordinates: [
        [centerLon - 0.001, centerLat - 0.001],
        [centerLon + 0.001, centerLat - 0.001],
        [centerLon + 0.001, centerLat + 0.001],
        [centerLon - 0.001, centerLat + 0.001],
        [centerLon - 0.001, centerLat - 0.001],
      ],
    },
    {
      type: 'forest',
      confidence: 0.87,
      area: 0.8,
      coordinates: [
        [centerLon - 0.002, centerLat + 0.001],
        [centerLon - 0.001, centerLat + 0.001],
        [centerLon - 0.001, centerLat + 0.002],
        [centerLon - 0.002, centerLat + 0.002],
        [centerLon - 0.002, centerLat + 0.001],
      ],
    },
    {
      type: 'water_body',
      confidence: 0.95,
      area: 0.3,
      coordinates: [
        [centerLon + 0.001, centerLat + 0.001],
        [centerLon + 0.002, centerLat + 0.001],
        [centerLon + 0.002, centerLat + 0.0015],
        [centerLon + 0.001, centerLat + 0.0015],
        [centerLon + 0.001, centerLat + 0.001],
      ],
    },
  ]
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

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const villageName = url.searchParams.get('village')
      const district = url.searchParams.get('district')
      const state = url.searchParams.get('state')

      let query = supabase
        .from('asset_maps')
        .select('*')

      if (villageName) query = query.eq('village_name', villageName)
      if (district) query = query.eq('district', district)
      if (state) query = query.eq('state', state)

      const { data: assets, error } = await query.order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch assets' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ assets }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { action, ...params } = body

      // Get user profile to check permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, district')
        .eq('id', user.id)
        .single()

      const isAdmin = profile && ['district_admin', 'state_admin', 'super_admin'].includes(profile.role)

      if (action === 'detect-assets') {
        const { coordinates, village, district, state } = params

        if (!coordinates || coordinates.length !== 4) {
          return new Response(
            JSON.stringify({ error: 'Invalid coordinates. Expected [minLon, minLat, maxLon, maxLat]' }), 
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Mock AI asset detection
        const detectedAssets = mockAssetDetection(coordinates)

        // Save detected assets to database if admin
        if (isAdmin) {
          const assetPromises = detectedAssets.map((asset) => 
            supabase.from('asset_maps').insert({
              village_name: village || 'Unknown',
              district: district || profile?.district || 'Unknown',
              state: state || 'Unknown',
              asset_type: asset.type,
              geojson: {
                type: 'Polygon',
                coordinates: [asset.coordinates]
              },
              source: 'ai_detection',
              last_updated: new Date().toISOString()
            })
          )

          await Promise.all(assetPromises)
        }

        // Log the action
        await supabase
          .from('logs')
          .insert({
            user_id: user.id,
            action: 'detect_assets',
            metadata: {
              village,
              district,
              state,
              coordinates,
              assets_detected: detectedAssets.length
            }
          })

        return new Response(
          JSON.stringify({ 
            assets: detectedAssets,
            totalArea: detectedAssets.reduce((sum, asset) => sum + asset.area, 0),
            saved: isAdmin
          }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (action === 'manual-upload') {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: 'Admin privileges required' }), 
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const { villageName, district, state, assetType, geoJson } = params

        if (!villageName || !district || !state || !assetType || !geoJson) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }), 
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const { data: asset, error } = await supabase
          .from('asset_maps')
          .insert({
            village_name: villageName,
            district,
            state,
            asset_type: assetType,
            geojson: geoJson,
            source: 'manual_upload'
          })
          .select()
          .single()

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to create asset' }), 
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
            action: 'manual_upload_asset',
            metadata: {
              asset_id: asset.id,
              village_name: villageName,
              district,
              state,
              asset_type: assetType
            }
          })

        return new Response(
          JSON.stringify({ success: true, asset }), 
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
      // Get user profile to check permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
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

      const url = new URL(req.url)
      const assetId = url.searchParams.get('id')
      
      if (!assetId) {
        return new Response(
          JSON.stringify({ error: 'Asset ID is required' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const body = await req.json()
      const { assetType, geoJson } = body

      const { data: asset, error } = await supabase
        .from('asset_maps')
        .update({
          asset_type: assetType,
          geojson: geoJson,
          last_updated: new Date().toISOString()
        })
        .eq('id', assetId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update asset' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, asset }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'DELETE') {
      // Get user profile to check permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
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

      const url = new URL(req.url)
      const assetId = url.searchParams.get('id')
      
      if (!assetId) {
        return new Response(
          JSON.stringify({ error: 'Asset ID is required' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabase
        .from('asset_maps')
        .delete()
        .eq('id', assetId)

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete asset' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }), 
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
    console.error('Asset mapping error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

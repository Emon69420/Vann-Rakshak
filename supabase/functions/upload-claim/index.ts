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

interface ClaimUploadRequest {
  villageName: string
  district: string
  state: string
  claimType: 'IFR' | 'CR' | 'CFR'
  areaHectares: number
  documentFile?: File
  shapefileData?: any
}

serve(async (req) => {
  // Handle CORS
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
      const formData = await req.formData()
      
      // Extract form data
      const villageName = formData.get('villageName') as string
      const district = formData.get('district') as string
      const state = formData.get('state') as string
      const claimType = formData.get('claimType') as 'IFR' | 'CR' | 'CFR'
      const areaHectares = parseFloat(formData.get('areaHectares') as string)
      const documentFile = formData.get('document') as File
      const shapefileData = formData.get('shapefile') as string

      // Validate required fields
      if (!villageName || !district || !state || !claimType || !areaHectares) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Upload document to storage if provided
      let documentUrl = null
      let aiMetadata = null

      if (documentFile) {
        const fileName = `${user.id}/${Date.now()}_${documentFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fra-claims-docs')
          .upload(fileName, documentFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Document upload failed:', uploadError)
          return new Response(
            JSON.stringify({ error: 'Failed to upload document' }), 
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        documentUrl = uploadData.path

        // Process document with AI (mock implementation)
        try {
          // In production, this would call actual AI services
          aiMetadata = {
            ocrResult: {
              extractedText: "Mock OCR text from uploaded document",
              confidence: 0.85
            },
            nerResult: {
              entities: [
                { text: villageName, label: 'VILLAGE', confidence: 0.9 },
                { text: district, label: 'DISTRICT', confidence: 0.9 }
              ]
            },
            extractedMetadata: {
              applicantName: "Ram Kumar",
              villageName,
              district,
              state,
              claimType,
              areaInHectares: areaHectares
            }
          }
        } catch (error) {
          console.error('AI processing failed:', error)
          // Continue without AI metadata
        }
      }

      // Upload shapefile if provided
      let shapefileUrl = null
      if (shapefileData) {
        const shapefileName = `${user.id}/${Date.now()}_shapefile.json`
        const { data: shapefileUpload, error: shapefileError } = await supabase.storage
          .from('fra-shapefiles')
          .upload(shapefileName, new Blob([shapefileData], { type: 'application/json' }), {
            cacheControl: '3600',
            upsert: false
          })

        if (!shapefileError) {
          shapefileUrl = shapefileUpload.path
        }
      }

      // Create claim record
      const { data: claim, error: claimError } = await supabase
        .from('fra_claims')
        .insert({
          user_id: user.id,
          village_name: villageName,
          district,
          state,
          claim_type: claimType,
          area_hectares: areaHectares,
          document_url: documentUrl,
          shapefile_url: shapefileUrl,
          metadata_json: aiMetadata,
          status: 'pending'
        })
        .select()
        .single()

      if (claimError) {
        console.error('Failed to create claim:', claimError)
        return new Response(
          JSON.stringify({ error: 'Failed to create claim record' }), 
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
          action: 'upload_claim',
          metadata: {
            claim_id: claim.id,
            village_name: villageName,
            district,
            state
          }
        })

      return new Response(
        JSON.stringify({ 
          success: true, 
          claim,
          aiMetadata: aiMetadata ? {
            extractedText: aiMetadata.ocrResult?.extractedText?.substring(0, 200) + '...',
            entitiesFound: aiMetadata.nerResult?.entities?.length || 0,
            confidence: aiMetadata.ocrResult?.confidence || 0
          } : null
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
    console.error('Upload claim error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

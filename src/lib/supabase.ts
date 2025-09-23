import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export type UserRole = 'patta_holder' | 'district_admin' | 'state_admin' | 'super_admin'
export type ClaimType = 'IFR' | 'CR' | 'CFR'
export type ClaimStatus = 'pending' | 'approved' | 'rejected'
export type AssetType = 'agriculture' | 'forest' | 'water_body' | 'homestead'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  district: string | null
  created_at: string
  updated_at: string
}

export interface FraClaim {
  id: string
  user_id: string
  village_name: string
  district: string
  state: string
  claim_type: ClaimType
  area_hectares: number
  status: ClaimStatus
  submitted_at: string
  approved_at: string | null
  approved_by: string | null
  shapefile_url: string | null
  document_url: string | null
  metadata_json: any
  created_at: string
  updated_at: string
}

export interface AssetMap {
  id: string
  village_name: string
  district: string
  state: string
  asset_type: AssetType
  geojson: any
  map_tile_url: string | null
  source: string
  last_updated: string
  created_at: string
}

export interface SchemeRecommendation {
  id: string
  fra_claim_id: string
  recommended_schemes: any[]
  generated_at: string
  engine_version: string
}

export interface Log {
  id: string
  user_id: string | null
  action: string
  metadata: any
  timestamp: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for backend operations (when available)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'patta_holder' | 'district_admin' | 'state_admin' | 'super_admin'
          district: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'patta_holder' | 'district_admin' | 'state_admin' | 'super_admin'
          district?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'patta_holder' | 'district_admin' | 'state_admin' | 'super_admin'
          district?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fra_claims: {
        Row: {
          id: string
          user_id: string
          village_name: string
          district: string
          state: string
          claim_type: 'IFR' | 'CR' | 'CFR'
          area_hectares: number
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          approved_at: string | null
          approved_by: string | null
          shapefile_url: string | null
          document_url: string | null
          metadata_json: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          village_name: string
          district: string
          state: string
          claim_type: 'IFR' | 'CR' | 'CFR'
          area_hectares: number
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          approved_at?: string | null
          approved_by?: string | null
          shapefile_url?: string | null
          document_url?: string | null
          metadata_json?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          village_name?: string
          district?: string
          state?: string
          claim_type?: 'IFR' | 'CR' | 'CFR'
          area_hectares?: number
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          approved_at?: string | null
          approved_by?: string | null
          shapefile_url?: string | null
          document_url?: string | null
          metadata_json?: any
          created_at?: string
          updated_at?: string
        }
      }
      asset_maps: {
        Row: {
          id: string
          village_name: string
          district: string
          state: string
          asset_type: 'agriculture' | 'forest' | 'water_body' | 'homestead'
          geojson: any
          map_tile_url: string | null
          source: string
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          village_name: string
          district: string
          state: string
          asset_type: 'agriculture' | 'forest' | 'water_body' | 'homestead'
          geojson?: any
          map_tile_url?: string | null
          source?: string
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          village_name?: string
          district?: string
          state?: string
          asset_type?: 'agriculture' | 'forest' | 'water_body' | 'homestead'
          geojson?: any
          map_tile_url?: string | null
          source?: string
          last_updated?: string
          created_at?: string
        }
      }
      scheme_recommendations: {
        Row: {
          id: string
          fra_claim_id: string
          recommended_schemes: any
          generated_at: string
          engine_version: string
        }
        Insert: {
          id?: string
          fra_claim_id: string
          recommended_schemes: any
          generated_at?: string
          engine_version?: string
        }
        Update: {
          id?: string
          fra_claim_id?: string
          recommended_schemes?: any
          generated_at?: string
          engine_version?: string
        }
      }
      logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          metadata: any
          timestamp: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          metadata?: any
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          metadata?: any
          timestamp?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type FraClaim = Database['public']['Tables']['fra_claims']['Row']
export type AssetMap = Database['public']['Tables']['asset_maps']['Row']
export type SchemeRecommendation = Database['public']['Tables']['scheme_recommendations']['Row']
export type Log = Database['public']['Tables']['logs']['Row']

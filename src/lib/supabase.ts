import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Environment variables from .env.example
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage (React components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// For server-side usage (API routes, Server Components)
export function createServerSupabaseClient() {
  // For API routes, we'll use the standard client without cookie handling
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}

// For Server Components that need cookie access
export function createServerSupabaseClientWithCookies(cookieStore: any) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Database types for TypeScript
export interface Driver {
  id: string
  steam_id: string
  username: string
  display_name: string
  avatar_url?: string
  elo_rating: number
  total_races: number
  wins: number
  podiums: number
  clean_races: number
  best_lap_time?: number
  created_at: string
  updated_at: string
  is_admin: boolean
  access_level: 'admin' | 'moderator' | 'user'
}

export interface RaceResult {
  id: string
  event_id: string
  driver_id: string
  position: number
  car_model: string
  car_number: number
  best_lap_time?: number
  total_time?: number
  gap_to_leader?: number
  laps_completed: number
  dnf: boolean
  dnf_reason?: string
  points_earned: number
  elo_change: number
  created_at: string
}

export interface Event {
  id: string
  name: string
  track: string
  event_type: 'sprint' | 'endurance' | 'championship'
  scheduled_start: string
  max_participants: number
  current_participants: number
  status: 'scheduled' | 'registration_open' | 'full' | 'in_progress' | 'completed' | 'cancelled'
  configuration_preset_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ConfigurationPreset {
  id: string
  name: string
  description: string
  created_by: string
  is_public: boolean
  configuration: any
  settings: any
  event: any
  event_rules: any
  assist_rules: any
  entrylist: any
  created_at: string
  updated_at: string
}
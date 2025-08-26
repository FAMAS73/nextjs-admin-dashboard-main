import { createServerSupabaseClient } from './supabase'
import { NextRequest } from 'next/server'

export interface AccessValidationResult {
  valid: boolean
  user?: any
  error?: string
}

/**
 * Validate server control access (FR-12: Access Control)
 * Checks both user authentication and access keys
 */
export async function validateServerAccess(request: NextRequest): Promise<AccessValidationResult> {
  const supabase = createServerSupabaseClient()
  
  try {
    // First check for access key in header
    const accessKey = request.headers.get('x-server-access-key')
    
    if (accessKey) {
      // Validate access key
      const { data: keyRecord, error: keyError } = await supabase
        .from('server_access_keys')
        .select('*')
        .eq('access_key', accessKey)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .single()

      if (keyError || !keyRecord) {
        return { valid: false, error: 'Invalid or expired access key' }
      }

      // Update last used timestamp
      await supabase
        .from('server_access_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyRecord.id)

      // Get the user who created this key
      const { data: keyUser } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', keyRecord.created_by)
        .single()

      return { 
        valid: true, 
        user: keyUser,
        accessMethod: 'key'
      }
    }

    // Fall back to regular user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { valid: false, error: 'Authentication required' }
    }

    // Check if user has admin privileges
    const { data: profile } = await supabase
      .from('drivers')
      .select('*')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    if (!profile?.is_admin && profile?.access_level !== 'admin') {
      return { valid: false, error: 'Admin access required' }
    }

    return { 
      valid: true, 
      user: profile,
      accessMethod: 'user'
    }

  } catch (error) {
    console.error('Access validation error:', error)
    return { valid: false, error: 'Access validation failed' }
  }
}

/**
 * Check if user can view live data (public leaderboard is viewable by all)
 */
export async function validateViewAccess(request: NextRequest): Promise<AccessValidationResult> {
  // Live data viewing is generally public for leaderboards (FR-01)
  // But detailed server control info requires authentication
  const { pathname } = new URL(request.url)
  
  if (pathname.includes('leaderboard') && !pathname.includes('admin')) {
    return { valid: true } // Public leaderboard access
  }
  
  return validateServerAccess(request)
}

/**
 * Rate limiting for server control actions
 */
const actionLimits = new Map<string, { count: number, resetTime: number }>()

export function checkRateLimit(userId: string, action: string, maxActions = 10, windowMs = 60000): boolean {
  const key = `${userId}:${action}`
  const now = Date.now()
  const limit = actionLimits.get(key)
  
  if (!limit || now > limit.resetTime) {
    actionLimits.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (limit.count >= maxActions) {
    return false
  }
  
  limit.count++
  return true
}
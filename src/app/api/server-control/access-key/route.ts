import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Generate server control access key (FR-12)
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user profile to check admin status
    const { data: profile } = await supabase
      .from('drivers')
      .select('is_admin, access_level')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    if (!profile?.is_admin && profile?.access_level !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { expiresIn = 24, description } = body // Default 24 hours

    // Generate secure access key
    const accessKey = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + (expiresIn * 60 * 60 * 1000)) // Hours to milliseconds

    // Store access key in database
    const { data: keyRecord, error } = await supabase
      .from('server_access_keys')
      .insert({
        access_key: accessKey,
        created_by: user.id,
        description: description || 'Server control key',
        expires_at: expiresAt.toISOString(),
        is_active: true,
        uses_remaining: null // Unlimited uses
      })
      .select()
      .single()

    if (error) {
      console.error('Access key creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create access key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...keyRecord,
        access_key: accessKey // Only return the key once for security
      }
    })

  } catch (error) {
    console.error('Access key API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get active access keys (admin only)
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('drivers')
      .select('is_admin, access_level')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    if (!profile?.is_admin && profile?.access_level !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get active access keys (without the actual key for security)
    const { data: keys, error } = await supabase
      .from('server_access_keys')
      .select('id, description, created_at, expires_at, is_active, last_used_at')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Access keys fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch access keys' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: keys || []
    })

  } catch (error) {
    console.error('Access keys API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Revoke access key
export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const keyId = searchParams.get('id')
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    if (!keyId) {
      return NextResponse.json(
        { success: false, error: 'Key ID is required' },
        { status: 400 }
      )
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('drivers')
      .select('is_admin, access_level')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    if (!profile?.is_admin && profile?.access_level !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Revoke access key
    const { error } = await supabase
      .from('server_access_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('created_by', user.id)

    if (error) {
      console.error('Access key revocation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to revoke access key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Access key revoked successfully'
    })

  } catch (error) {
    console.error('Access key revocation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
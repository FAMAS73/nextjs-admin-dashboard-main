import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// Get user profile
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get driver profile from database
    const { data: driver, error: profileError } = await supabase
      .from('drivers')
      .select('*')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // If no profile exists, create one (FR-04: Steam Account Linking)
    if (!driver) {
      const newDriver = {
        steam_id: user.user_metadata?.provider_id || user.id,
        username: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown Driver',
        avatar_url: user.user_metadata?.avatar_url,
        elo_rating: 1500, // Starting ELO as per FR-15
        total_races: 0,
        wins: 0,
        podiums: 0,
        clean_races: 0,
        is_admin: false,
        access_level: 'user'
      }

      const { data: createdDriver, error: createError } = await supabase
        .from('drivers')
        .insert(newDriver)
        .select()
        .single()

      if (createError) {
        console.error('Profile creation error:', createError)
        return NextResponse.json(
          { success: false, error: 'Failed to create profile' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: createdDriver
      })
    }

    return NextResponse.json({
      success: true,
      data: driver
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update user profile (FR-03: Profile Editing)
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { display_name, short_name, nationality } = body

    // Validate input
    if (!display_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Display name is required' },
        { status: 400 }
      )
    }

    if (short_name && (short_name.length !== 3 || !/^[A-Z]{3}$/.test(short_name))) {
      return NextResponse.json(
        { success: false, error: 'Short name must be exactly 3 uppercase letters' },
        { status: 400 }
      )
    }

    // Update driver profile
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        display_name: display_name.trim(),
        short_name: short_name?.toUpperCase(),
        nationality: nationality || 0,
        updated_at: new Date().toISOString()
      })
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedDriver
    })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
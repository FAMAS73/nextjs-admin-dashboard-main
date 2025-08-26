import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// Upload media for race results (FR-13)
export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const raceId = formData.get('raceId') as string
    const description = formData.get('description') as string

    if (!file || !raceId) {
      return NextResponse.json(
        { success: false, error: 'File and race ID are required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', // Screenshots
      'video/mp4', 'video/webm', 'video/quicktime', // Videos
      'application/octet-stream' // Replay files (.acreplay)
    ]
    
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.acreplay')) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Allowed: images, videos, .acreplay files' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum 100MB allowed' },
        { status: 400 }
      )
    }

    // Check if user participated in this race
    const { data: participation, error: participationError } = await supabase
      .from('race_results')
      .select('id')
      .eq('event_id', raceId)
      .eq('driver_id', user.id)
      .single()

    if (participationError || !participation) {
      return NextResponse.json(
        { success: false, error: 'You can only upload media for races you participated in' },
        { status: 403 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `race-${raceId}/${user.id}-${timestamp}.${extension}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('race-media')
      .upload(filename, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('race-media')
      .getPublicUrl(filename)

    // Save media record to database
    const { data: mediaRecord, error: dbError } = await supabase
      .from('race_media')
      .insert({
        race_id: raceId,
        uploaded_by: user.id,
        filename: file.name,
        file_path: filename,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        description: description || '',
        media_type: file.type.startsWith('image/') ? 'screenshot' : 
                   file.type.startsWith('video/') ? 'video' : 'replay'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('race-media').remove([filename])
      
      return NextResponse.json(
        { success: false, error: 'Failed to save media record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mediaRecord
    })

  } catch (error) {
    console.error('Media upload API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get media for a race
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const raceId = searchParams.get('raceId')
  
  try {
    if (!raceId) {
      return NextResponse.json(
        { success: false, error: 'Race ID is required' },
        { status: 400 }
      )
    }

    // Get all media for the race with uploader info
    const { data: media, error } = await supabase
      .from('race_media')
      .select(`
        *,
        uploader:uploaded_by (
          display_name,
          avatar_url
        )
      `)
      .eq('race_id', raceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Media fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch media' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: media || []
    })

  } catch (error) {
    console.error('Media fetch API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete media (only by uploader or admin)
export async function DELETE(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const mediaId = searchParams.get('id')
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Get media record to check ownership
    const { data: media, error: mediaError } = await supabase
      .from('race_media')
      .select('*')
      .eq('id', mediaId)
      .single()

    if (mediaError || !media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    // Check if user owns this media or is admin
    const { data: profile } = await supabase
      .from('drivers')
      .select('is_admin, access_level')
      .eq('steam_id', user.user_metadata?.provider_id || user.id)
      .single()

    const isOwner = media.uploaded_by === user.id
    const isAdmin = profile?.is_admin || profile?.access_level === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('race-media')
      .remove([media.file_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete database record
    const { error: dbError } = await supabase
      .from('race_media')
      .delete()
      .eq('id', mediaId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete media' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error) {
    console.error('Media delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
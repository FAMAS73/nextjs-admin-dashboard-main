import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const requestUrl = new URL(request.url)
  
  // Initiate Steam OAuth flow via Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'steam',
    options: {
      redirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Steam OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
  }

  if (data.url) {
    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
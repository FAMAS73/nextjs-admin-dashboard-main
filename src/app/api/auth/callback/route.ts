import { createServerSupabaseClientWithCookies } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClientWithCookies(cookieStore)
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the dashboard after successful authentication
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
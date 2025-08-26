import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const requestUrl = new URL(request.url)
  
  // Sign out the user
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
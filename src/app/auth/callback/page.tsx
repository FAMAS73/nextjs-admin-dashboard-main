"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          router.push('/')
        } else {
          // No session, redirect to auth page
          router.push('/auth')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-1 dark:bg-gray-dark">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        <h1 className="text-lg font-semibold text-dark dark:text-white mb-2">
          Completing sign in...
        </h1>
        <p className="text-sm text-dark-5 dark:text-dark-6">
          Please wait while we complete your Steam authentication.
        </p>
      </div>
    </div>
  )
}
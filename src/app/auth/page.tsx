"use client";

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SteamSignInButton } from '@/components/Auth/SteamSignIn'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setLoading(false)
      }
    }

    // Check for error in URL params
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError('Authentication failed. Please try signing in again.')
          break
        case 'unexpected_error':
          setError('An unexpected error occurred. Please try again.')
          break
        default:
          setError('Authentication error. Please try again.')
      }
    }

    checkAuth()
  }, [router, searchParams])

  const handleSteamSignIn = async () => {
    try {
      setError(null)
      setLoading(true)

      // For development, we'll simulate the Steam sign-in
      // In production, this would redirect to Steam OAuth via Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'steam',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('Steam sign-in error:', error)
      setError('Steam authentication is not yet configured. Please contact the administrator.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-1 dark:bg-gray-dark">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <p className="text-sm text-dark-5 dark:text-dark-6">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-1 dark:bg-gray-dark px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-dark rounded-lg shadow-card border border-stroke dark:border-stroke-dark p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
              ACC Server Manager
            </h1>
            <p className="text-dark-5 dark:text-dark-6">
              Sign in to manage your racing server and track your performance
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red/10 border border-red/20">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Steam Sign In */}
          <div className="space-y-6">
            <SteamSignInButton onSignIn={handleSteamSignIn} />

            {/* Demo Access */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stroke dark:border-stroke-dark" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-dark px-2 text-dark-5 dark:text-dark-6">
                  or
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full inline-flex items-center justify-center rounded-md border border-stroke dark:border-stroke-dark bg-transparent px-6 py-3 text-sm font-medium text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-gray-dark/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Continue as Guest (Demo Mode)
            </button>

            <p className="text-center text-xs text-dark-5 dark:text-dark-6">
              Guest access provides limited functionality. Sign in with Steam for full features including driver profiles, saved configurations, and race statistics.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-stroke dark:border-stroke-dark text-center">
            <p className="text-xs text-dark-4 dark:text-dark-5">
              By signing in, you agree to connect your Steam account for racing identification and server management access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
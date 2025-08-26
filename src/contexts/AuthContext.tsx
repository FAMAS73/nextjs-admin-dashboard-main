"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Driver } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  driver: Driver | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithSteam: () => Promise<void>
  refreshDriver: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadDriverProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadDriverProfile(session.user.id)
      } else {
        setDriver(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadDriverProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading driver profile:', error)
        setLoading(false)
        return
      }

      if (data) {
        setDriver(data)
      } else {
        // Create driver profile if it doesn't exist
        await createDriverProfile(userId)
      }
    } catch (error) {
      console.error('Error in loadDriverProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDriverProfile = async (userId: string) => {
    try {
      // Extract Steam ID from user metadata if available
      const steamId = user?.user_metadata?.provider_id || user?.user_metadata?.steam_id || userId
      const username = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Unknown Driver'
      
      const newDriver = {
        id: userId,
        steam_id: steamId,
        username,
        display_name: username,
        avatar_url: user?.user_metadata?.avatar_url,
        elo_rating: 1500, // Starting ELO rating
        total_races: 0,
        wins: 0,
        podiums: 0,
        clean_races: 0,
        is_admin: false,
        access_level: 'user' as const
      }

      const { data, error } = await supabase
        .from('drivers')
        .insert([newDriver])
        .select()
        .single()

      if (error) {
        console.error('Error creating driver profile:', error)
        return
      }

      setDriver(data)
    } catch (error) {
      console.error('Error in createDriverProfile:', error)
    }
  }

  const signInWithSteam = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'steam',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Error signing in with Steam:', error)
        alert('Failed to sign in with Steam. Please try again.')
      }
    } catch (error) {
      console.error('Error in signInWithSteam:', error)
      alert('Failed to sign in with Steam. Please try again.')
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  const refreshDriver = async () => {
    if (user) {
      await loadDriverProfile(user.id)
    }
  }

  const value = {
    user,
    driver,
    loading,
    signOut,
    signInWithSteam,
    refreshDriver
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
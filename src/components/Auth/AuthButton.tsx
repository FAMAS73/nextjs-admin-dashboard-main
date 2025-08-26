"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithSteam = () => {
    window.location.href = '/api/auth/steam';
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="text-sm text-dark-5 dark:text-dark-6">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-stroke dark:border-stroke-dark"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-dark dark:text-white">
            {user.user_metadata?.full_name || user.user_metadata?.name || 'Driver'}
          </span>
          <button
            onClick={signOut}
            className="text-xs text-dark-4 hover:text-red dark:text-dark-7 dark:hover:text-red"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithSteam}
      className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142c0-.016-.002-.032-.002-.047C11.413 5.178 14.586 2 18.335 2s6.922 3.178 6.922 7.922-3.177 7.922-6.922 7.922h-.059l-4.143 2.971c.003.063.007.127.007.19 0 1.559-1.269 2.828-2.828 2.828-1.244 0-2.297-.813-2.666-1.932l-4.594-1.9C7.834 21.027 11.745 24 16.479 24c6.299 0 11.479-5.101 11.479-11.479C27.958 5.521 22.857.421 16.479.421H11.979v-.421z"/>
      </svg>
      <span>Sign in with Steam</span>
    </button>
  );
}
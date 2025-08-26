"use client";

interface SteamSignInProps {
  onSignIn?: () => void
  className?: string
}

export function SteamSignIn({ onSignIn, className }: SteamSignInProps) {
  const handleSteamSignIn = () => {
    // For now, we'll use a mock Steam sign-in until Supabase is configured
    if (onSignIn) {
      onSignIn()
    } else {
      // Redirect to Steam OAuth (would be configured in Supabase)
      alert("Steam authentication would redirect to Steam OAuth. Configure Supabase with Steam provider to enable this feature.")
    }
  }

  return (
    <button
      onClick={handleSteamSignIn}
      className={`inline-flex items-center justify-center rounded-md bg-[#171a21] px-6 py-3 text-sm font-medium text-white hover:bg-[#2a475e] focus:outline-none focus:ring-2 focus:ring-[#66c0f4] focus:ring-offset-2 transition-colors ${className || ''}`}
    >
      <svg
        className="mr-3 h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1.5 15.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5c.69 0 1.31.28 1.76.73L11.5 15c-.28-.28-.67-.45-1.1-.45-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.83 0 1.5-.67 1.5-1.5h1.5c0 1.66-1.34 3-3 3zm6-6c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
      </svg>
      Sign in with Steam
    </button>
  )
}

export function SteamSignInButton({ className, ...props }: SteamSignInProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <SteamSignIn className={`w-full ${className || ''}`} {...props} />
      
      <p className="mt-4 text-center text-sm text-dark-5 dark:text-dark-6">
        Sign in with your Steam account to access driver profiles, save configurations, and participate in racing events.
      </p>
      
      <div className="mt-6 text-center">
        <details className="text-sm">
          <summary className="cursor-pointer text-primary hover:text-primary/80">
            Why Steam authentication?
          </summary>
          <div className="mt-2 space-y-2 text-dark-5 dark:text-dark-6">
            <p>• Your Steam profile provides your racing identity</p>
            <p>• ACC uses Steam for multiplayer authentication</p>
            <p>• Secure OAuth login without sharing passwords</p>
            <p>• Automatic driver statistics and race history</p>
          </div>
        </details>
      </div>
    </div>
  )
}
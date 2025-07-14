"use client"

import { ReactNode } from "react"
import { useAuth } from "./auth-provider"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  console.log("[AuthGuard] isAuthenticated:", isAuthenticated)

  // The browser's native auth dialog will be triggered automatically
  // when the API returns 401 with WWW-Authenticate header
  // No need to manually trigger it here

  const handleLogin = async () => {
    // Trigger API call which will show browser's native auth dialog
    try {
      await fetch('/api/projects')
    } catch (error) {
      console.log('Auth trigger error:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">Authentication Required</div>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
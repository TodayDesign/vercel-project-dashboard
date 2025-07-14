"use client"

import { ReactNode } from "react"
import { useAuth } from "./auth-provider"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, login } = useAuth()

  console.log("[AuthGuard] isAuthenticated:", isAuthenticated)

  // The browser's native auth dialog will be triggered automatically
  // when the API returns 401 with WWW-Authenticate header

  const handleLogin = async () => {
    // Trigger API call which will show browser's native auth dialog
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        // Authentication succeeded, update React state
        await login('authenticated-user', 'placeholder') // Dummy values since browser handled real auth
      }
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
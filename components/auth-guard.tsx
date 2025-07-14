"use client"

import { ReactNode } from "react"
import { useAuth } from "./auth-provider"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, login } = useAuth()

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        await login('authenticated-user', 'placeholder')
      }
    } catch (error) {
      console.error('Auth trigger error:', error)
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
"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)


  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // Test authentication by making a request to a protected endpoint
      const credentials = btoa(`${username}:${password}`)
      const response = await fetch("/api/projects", {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setUsername(username)
        return true
      } else {
        return false
      }
    } catch {
      return false
    }
  }, [])

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
    // Note: Browser credentials cannot be programmatically cleared
    // User will need to manually clear them in browser settings if needed
  }


  // Check for authentication on mount by testing API access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          // User is already authenticated via browser credentials
          setIsAuthenticated(true)
          // Try to extract username from response if possible
          // For now, set a default since we can't easily get it from browser auth
          setUsername('authenticated-user')
        }
      } catch (error) {
        console.log('[AuthProvider] Initial auth check failed:', error)
      }
    }

    if (typeof window !== "undefined" && !isAuthenticated) {
      checkAuth()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
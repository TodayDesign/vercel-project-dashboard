"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

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
      // If username is 'authenticated-user', it means browser auth already succeeded
      if (username === 'authenticated-user') {
        setIsAuthenticated(true)
        setUsername('authenticated-user')
        return true
      }

      // Otherwise, test authentication by making a request with explicit credentials
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


  // No automatic auth check - let the browser handle authentication
  // Authentication state will be set only after successful manual login

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
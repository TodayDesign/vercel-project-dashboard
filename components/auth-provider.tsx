"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  showAuthDialog: () => void
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

  useEffect(() => {
    console.log("[AuthProvider] Checking stored credentials")
    // Check if user is already authenticated (stored credentials)
    const storedAuth = localStorage.getItem("auth-credentials")
    console.log("[AuthProvider] Stored auth:", storedAuth ? "found" : "not found")
    
    if (storedAuth) {
      try {
        const { username: storedUsername } = JSON.parse(storedAuth)
        console.log("[AuthProvider] Setting authenticated user:", storedUsername)
        setUsername(storedUsername)
        setIsAuthenticated(true)
      } catch {
        console.log("[AuthProvider] Failed to parse stored auth, removing")
        localStorage.removeItem("auth-credentials")
      }
    }
  }, [])

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
        // Store credentials for session persistence
        localStorage.setItem("auth-credentials", JSON.stringify({ username, credentials }))
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
    localStorage.removeItem("auth-credentials")
  }

  const showAuthDialog = useCallback(() => {
    // Create a modal dialog with form
    const dialog = document.createElement('div')
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    const form = document.createElement('div')
    form.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      min-width: 300px;
      max-width: 400px;
    `

    form.innerHTML = `
      <h2 style="margin: 0 0 1.5rem 0; font-size: 1.5rem; font-weight: 600; text-align: center;">
        Authentication Required
      </h2>
      <form id="auth-form">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Username:</label>
          <input 
            type="text" 
            id="username" 
            required 
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
            placeholder="Enter username"
          />
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password:</label>
          <input 
            type="password" 
            id="password" 
            required 
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
            placeholder="Enter password"
          />
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button 
            type="submit" 
            style="flex: 1; background: #3b82f6; color: white; padding: 0.75rem; border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer;"
          >
            Login
          </button>
          <button 
            type="button" 
            id="cancel-btn"
            style="flex: 1; background: #6b7280; color: white; padding: 0.75rem; border: none; border-radius: 0.375rem; font-weight: 500; cursor: pointer;"
          >
            Cancel
          </button>
        </div>
      </form>
      <div id="error-message" style="margin-top: 1rem; color: #dc2626; text-align: center; display: none;"></div>
    `

    dialog.appendChild(form)
    document.body.appendChild(dialog)

    const usernameInput = form.querySelector('#username') as HTMLInputElement
    const passwordInput = form.querySelector('#password') as HTMLInputElement
    const authForm = form.querySelector('#auth-form') as HTMLFormElement
    const cancelBtn = form.querySelector('#cancel-btn') as HTMLButtonElement
    const errorMessage = form.querySelector('#error-message') as HTMLDivElement

    // Focus username input
    usernameInput.focus()

    const cleanup = () => {
      document.body.removeChild(dialog)
    }

    // Handle form submission
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const username = usernameInput.value.trim()
      const password = passwordInput.value

      if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password'
        errorMessage.style.display = 'block'
        return
      }

      // Disable form during login attempt
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
      submitBtn.disabled = true
      submitBtn.textContent = 'Logging in...'

      try {
        const success = await login(username, password)
        if (success) {
          cleanup()
        } else {
          errorMessage.textContent = 'Invalid credentials. Please try again.'
          errorMessage.style.display = 'block'
          submitBtn.disabled = false
          submitBtn.textContent = 'Login'
          passwordInput.value = '' // Clear password on failure
          passwordInput.focus()
        }
      } catch (error) {
        errorMessage.textContent = 'Login failed. Please try again.'
        errorMessage.style.display = 'block'
        submitBtn.disabled = false
        submitBtn.textContent = 'Login'
      }
    })

    // Handle cancel
    cancelBtn.addEventListener('click', cleanup)

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup()
        document.removeEventListener('keydown', handleEscape)
      }
    }
    document.addEventListener('keydown', handleEscape)

    // Handle click outside
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        cleanup()
      }
    })
  }, [login])

  // Intercept fetch requests to add authentication headers
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      const storedAuth = localStorage.getItem("auth-credentials")
      if (storedAuth) {
        const { credentials } = JSON.parse(storedAuth)
        
        // Override the global fetch to add auth headers
        const originalFetch = window.fetch
        window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
          console.log("[AuthProvider] Intercepting fetch request:", input)
          const authInit: RequestInit = {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Basic ${credentials}`,
            },
          }
          console.log("[AuthProvider] Added auth headers to request")
          return originalFetch(input, authInit)
        }

        // Cleanup function to restore original fetch
        return () => {
          window.fetch = originalFetch
        }
      }
    }
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        showAuthDialog,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
"use client"

import { useEffect, useState, useRef, ReactNode } from "react"
import { useAuth } from "./auth-provider"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, showAuthDialog } = useAuth()
  const hasShownDialogRef = useRef(false)

  console.log("[AuthGuard] isAuthenticated:", isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated && !hasShownDialogRef.current) {
      console.log("[AuthGuard] Showing auth dialog")
      // Show authentication dialog only once when component mounts
      const timer = setTimeout(() => {
        showAuthDialog()
        hasShownDialogRef.current = true
      }, 100) // Small delay to ensure the component is mounted

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, showAuthDialog])

  // Reset the dialog flag when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      hasShownDialogRef.current = false
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">Authentication Required</div>
          <button
            onClick={showAuthDialog}
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
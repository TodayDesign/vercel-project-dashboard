"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, LogOut, User } from "lucide-react"
import { useAuth } from "./auth-provider"
import Image from "next/image"

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export function DashboardHeader({ isRefreshing, onRefresh }: DashboardHeaderProps) {
  const { username, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo-square.jpg" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Today Vercel Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
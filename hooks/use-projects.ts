import { useState, useEffect } from "react"
import { Project } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

interface UseProjectsReturn {
  projects: Project[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("[useProjects] isAuthenticated:", isAuthenticated)
    if (isAuthenticated) {
      console.log("[useProjects] Fetching projects")
      fetchProjects()
    }
  }, [isAuthenticated])

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  }
}
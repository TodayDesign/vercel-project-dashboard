import { useState, useEffect } from "react"
import { ProjectWithSource } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

interface UseProjectsReturn {
  projects: ProjectWithSource[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithSource[]>([])
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
    if (isAuthenticated) {
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
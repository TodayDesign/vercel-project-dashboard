"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchAndFilters } from "@/components/search-and-filters"
import { ProjectGrid } from "@/components/project-grid"
import { useProjects } from "@/hooks/use-projects"

export default function VercelDashboard() {
  const { projects, isLoading, error, refetch } = useProjects()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    console.log('Raw project data: ', projects)
    console.log('Filtered projects: ', filteredProjects)
  }, [projects])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader isRefreshing={isRefreshing} onRefresh={handleRefresh} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">Error loading projects</div>
            <div className="text-gray-400 text-sm mt-2">{error}</div>
            <button 
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader isRefreshing={isRefreshing || isLoading} onRefresh={handleRefresh} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Loading projects...</div>
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} />
        )}
      </main>
    </div>
  )
}
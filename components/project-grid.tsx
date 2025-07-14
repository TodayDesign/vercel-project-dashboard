import { ProjectWithSource } from "@/lib/types"
import { EnhancedProjectCard } from "./enhanced-project-card"

interface ProjectGridProps {
  projects: ProjectWithSource[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No projects found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <EnhancedProjectCard key={project.transformed.id} project={project} />
      ))}
    </div>
  )
}
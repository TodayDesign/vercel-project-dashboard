import { convertVercelProjectToProject } from './project-utils'
import { VercelProject } from './types'
import exampleData from './example-vercel-project-data.json'

// Example usage of the conversion function
export function exampleUsage() {
  // Convert the example Vercel project data to our Project interface
  const vercelProject = exampleData as VercelProject
  const project = convertVercelProjectToProject(vercelProject)
  
  // console.log('Converted project:', {
  //   name: project.name,
  //   projectUrl: project.projectUrl,
  //   settingsUrl: project.settingsUrl,
  //   lastDeployment: {
  //     branch: project.lastDeployment.branch,
  //     commit: project.lastDeployment.commit,
  //     triggeredBy: project.lastDeployment.triggeredBy.name
  //   }
  // })
  
  return project
}

// Example of how the URLs are constructed:
// - projectUrl: "https://wedding.malyaris.com" (prefers custom domain)
// - settingsUrl: "https://vercel.com/team_vvOPe5hPVQA3MXDBRAAIpXUG/guy-malyaris-wedding/settings" 
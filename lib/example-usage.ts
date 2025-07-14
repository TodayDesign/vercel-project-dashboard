import { transformVercelProject } from './vercel-transform'
import { RawVercelProject } from './types'
import exampleData from './example-vercel-project-data.json'

// Example usage of the new transformation function
export function exampleUsage() {
  // Transform the example Vercel project data to our new structure
  const vercelProject = exampleData as RawVercelProject
  const projectWithSource = transformVercelProject(vercelProject)
  
  // console.log('Transformed project:', {
  //   name: projectWithSource.transformed.name,
  //   projectUrl: projectWithSource.transformed.projectUrl,
  //   settingsUrl: projectWithSource.transformed.settingsUrl,
  //   lastDeployment: {
  //     branch: projectWithSource.transformed.lastDeployment.branch,
  //     commit: projectWithSource.transformed.lastDeployment.commit,
  //     triggeredBy: projectWithSource.transformed.lastDeployment.triggeredBy.name
  //   }
  // })
  
  return projectWithSource
}

// Example of how the URLs are constructed:
// - projectUrl: "https://wedding.malyaris.com" (prefers custom domain)
// - settingsUrl: "https://vercel.com/team_vvOPe5hPVQA3MXDBRAAIpXUG/guy-malyaris-wedding/settings"
// - sourceCodeUrl: "https://github.com/nikmaly/guy-malyaris-wedding" 
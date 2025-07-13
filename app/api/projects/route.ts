import { NextResponse } from "next/server"
import { errorProjects } from "@/lib/mock-data"
import { transformVercelProject } from "@/lib/vercel-transform"
import { VercelProject } from "@/lib/vercel-api"

export async function GET() {
  try {
    // Check if we have a Vercel API token
    if (!process.env.VERCEL_API_TOKEN) {
      console.warn("VERCEL_API_TOKEN not found, using error data to indicate issue")
      return NextResponse.json({ projects: errorProjects })
    }

    // Fetch projects from Vercel API
    const projectsResponse = await fetch('https://api.vercel.com/v9/projects', {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!projectsResponse.ok) {
      throw new Error(`Vercel API error: ${projectsResponse.status} ${projectsResponse.statusText}`)
    }

    const projectsData = await projectsResponse.json()
    const vercelProjects: VercelProject[] = projectsData.projects || []

    // Transform each project using latestDeployments from project data
    const transformedProjects = vercelProjects.map((vercelProject) => {
      // Use the first deployment from latestDeployments if available
      const latestDeployment = vercelProject.latestDeployments?.[0]
      return transformVercelProject(vercelProject, latestDeployment)
    })

    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    console.error("Failed to fetch projects from Vercel API:", error)
    
    // Return error data to clearly indicate API failure
    console.log("Returning error data to indicate API failure")
    return NextResponse.json({ projects: errorProjects })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { errorProjects } from "@/lib/mock-data"
import { transformVercelProject } from "@/lib/vercel-transform"
import { VercelProject } from "@/lib/types"
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth"

/**
 * Returns error response when Vercel API token is not configured
 * @returns NextResponse with mock error projects data
 */
const errorResponseNoApiToken = () => {
  console.warn("[api/projects] VERCEL_API_TOKEN not found, using error data to indicate issue")
  return NextResponse.json({ projects: errorProjects })
}

/**
 * Returns error response when Vercel API request fails
 * @param error - The error that occurred during API request
 * @returns NextResponse with mock error projects data
 */
const errorResponseApiFailure = (error: Error) => {
  console.error("[api/projects] Failed to fetch projects from Vercel API:", error)
  
  // Return error data to clearly indicate API failure
  console.log("[api/projects] Returning error data to indicate API failure")
  return NextResponse.json({ projects: errorProjects })
}

/**
 * GET handler for /api/projects
 * Fetches projects from Vercel API or returns mock data if API is unavailable
 * @returns NextResponse with projects data
 */
export async function GET(request: NextRequest) {
  console.log("[api/projects] GET request received")
  
  // Check authentication
  const authResult = await requireAuth(request)
  console.log("[api/projects] Auth result:", authResult)
  
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error)
  }
  try {
    // Check if we have a Vercel API token
    if (!process.env.VERCEL_API_TOKEN) {
      return errorResponseNoApiToken()
    }

    // Fetch projects from Vercel API
    // If the project is a team project, an extra url param `team+id` is required
    const teamId = process.env.VERCEL_TEAM_ID
    const url = teamId ? `https://api.vercel.com/v9/projects?teamId=${teamId}` : 'https://api.vercel.com/v9/projects'
    const projectsResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    // ERROR RESPONSE: Vercel API error
    if (!projectsResponse.ok) {
      console.log("[api/projects] Vercel API error:")
      throw new Error(`Vercel API error: ${projectsResponse.status} ${projectsResponse.statusText}`)
    }

    const projectsData = await projectsResponse.json()
    const vercelProjects: VercelProject[] = projectsData.projects || []

    // Transform each project using latestDeployments from project data
    const transformedProjects = vercelProjects.map((vercelProject) => {
      // Use the first deployment from latestDeployments if available
      const latestDeployment = vercelProject.latestDeployments?.[0] as any
      return transformVercelProject(vercelProject, latestDeployment)
    })

    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    return errorResponseApiFailure(error as Error)
  }
}

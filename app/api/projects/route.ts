import { NextRequest, NextResponse } from "next/server"
import { errorProjects } from "@/lib/mock-data"
import { transformVercelProject } from "@/lib/vercel-transform"
import { VercelProject } from "@/lib/types"
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth"

/**
 * Returns 401 error response when Vercel API token is not configured
 * @returns NextResponse with 401 status
 */
const errorResponseNoApiToken = () => {
  console.warn("[api/projects] VERCEL_API_TOKEN not found")
  return NextResponse.json(
    { error: "Vercel API token not configured" }, 
    { status: 500 }
  )
}

/**
 * Returns error response when Vercel API request fails
 * @param error - The error that occurred during API request
 * @returns NextResponse with error status
 */
const errorResponseApiFailure = (error: Error) => {
  console.error("[api/projects] Failed to fetch projects from Vercel API:", error)
  return NextResponse.json(
    { error: "Failed to fetch projects from Vercel API" }, 
    { status: 502 }
  )
}

/**
 * GET handler for /api/projects
 * Fetches projects from Vercel API or returns mock data if API is unavailable
 * @returns NextResponse with projects data
 */
export async function GET(request: NextRequest) {
  console.log("[api/projects] GET request received")
  console.log("[api/projects] Request URL:", request.url)
  console.log("[api/projects] Request headers:", Object.fromEntries(request.headers.entries()))
  
  // Check authentication
  const authResult = await requireAuth(request)
  console.log("[api/projects] Auth result:", authResult)
  
  if (!authResult.success) {
    console.error("[api/projects] Authentication failed:", authResult.error)
    return createUnauthorizedResponse(authResult.error)
  }

  try {
    // Log environment variable status (without exposing sensitive values)
    console.log("[api/projects] Environment check:")
    console.log("[api/projects] - VERCEL_API_TOKEN exists:", !!process.env.VERCEL_API_TOKEN)
    console.log("[api/projects] - VERCEL_API_TOKEN length:", process.env.VERCEL_API_TOKEN?.length || 0)
    console.log("[api/projects] - VERCEL_TEAM_ID exists:", !!process.env.VERCEL_TEAM_ID)
    console.log("[api/projects] - VERCEL_TEAM_ID value:", process.env.VERCEL_TEAM_ID || "not set")
    
    // Check if we have a Vercel API token
    if (!process.env.VERCEL_API_TOKEN) {
      console.error("[api/projects] VERCEL_API_TOKEN is missing")
      return errorResponseNoApiToken()
    }

    // Fetch projects from Vercel API
    // If the project is a team project, an extra url param `team+id` is required
    const teamId = process.env.VERCEL_TEAM_ID
    const url = teamId ? `https://api.vercel.com/v9/projects?teamId=${teamId}` : 'https://api.vercel.com/v9/projects'
    
    console.log("[api/projects] Making request to Vercel API:")
    console.log("[api/projects] - URL:", url)
    console.log("[api/projects] - Team ID:", teamId || "not set")
    
    const projectsResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    console.log("[api/projects] Vercel API response received:")
    console.log("[api/projects] - Status:", projectsResponse.status)
    console.log("[api/projects] - Status text:", projectsResponse.statusText)
    console.log("[api/projects] - Response headers:", Object.fromEntries(projectsResponse.headers.entries()))

    // ERROR RESPONSE: Vercel API error
    if (!projectsResponse.ok) {
      const errorText = await projectsResponse.text()
      console.error("[api/projects] Vercel API error details:")
      console.error("[api/projects] - Status:", projectsResponse.status)
      console.error("[api/projects] - Status text:", projectsResponse.statusText)
      console.error("[api/projects] - Response body:", errorText)
      throw new Error(`Vercel API error: ${projectsResponse.status} ${projectsResponse.statusText} - ${errorText}`)
    }

    const projectsData = await projectsResponse.json()
    console.log("[api/projects] Projects data received:")
    console.log("[api/projects] - Number of projects:", projectsData.projects?.length || 0)
    console.log("[api/projects] - Projects data keys:", Object.keys(projectsData))
    
    const vercelProjects: VercelProject[] = projectsData.projects || []

    // Transform each project using latestDeployments from project data
    const transformedProjects = vercelProjects.map((vercelProject) => {
      // Use the first deployment from latestDeployments if available
      const latestDeployment = vercelProject.latestDeployments?.[0] as any
      return transformVercelProject(vercelProject, latestDeployment)
    })

    console.log("[api/projects] Successfully transformed projects:", transformedProjects.length)
    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    console.error("[api/projects] Caught error:", error)
    return errorResponseApiFailure(error as Error)
  }
}

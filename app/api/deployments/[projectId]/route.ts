import { NextRequest, NextResponse } from "next/server"
import { errorProjects } from "@/lib/mock-data"
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth"

/**
 * Returns error response when Vercel API token is not configured
 * @param params - Route parameters containing projectId
 * @returns NextResponse with error status
 */
const errorResponseNoApiToken = ({ params }: { params: { projectId: string } }) => {
  console.warn("[api/deployments/[projectId]] VERCEL_API_TOKEN not found")
  return NextResponse.json(
    { error: "Vercel API token not configured" }, 
    { status: 500 }
  )
}

/**
 * Returns error response when Vercel API request fails
 * @param params - Route parameters containing projectId
 * @param error - The error that occurred during API request
 * @returns NextResponse with error status
 */
const errorResponseProjectNotFound = ({ params }: { params: { projectId: string } }, error: Error) => {
  console.error("[api/deployments/[projectId]] Failed to fetch deployments from Vercel API:", error)
  return NextResponse.json(
    { error: "Failed to fetch deployments from Vercel API" }, 
    { status: 502 }
  )
}

/**
 * GET handler for /api/deployments/[projectId]
 * Fetches deployments for a specific project from Vercel API or returns mock data if API is unavailable
 * @param request - The incoming request object
 * @param params - Route parameters containing projectId
 * @returns NextResponse with deployments data for the project
 */
export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  // Check authentication
  const authResult = await requireAuth(request)
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error)
  }
  try {
    // Check if we have a Vercel API token
    if (!process.env.VERCEL_API_TOKEN) {
      return errorResponseNoApiToken({ params })
    }

    // Fetch deployments from Vercel API
    const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${params.projectId}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return errorResponseProjectNotFound({ params }, error as Error)
  }
}

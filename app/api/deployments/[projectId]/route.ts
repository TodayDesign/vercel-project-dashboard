import { NextResponse } from "next/server"
import { errorProjects } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    // Check if we have a Vercel API token
    if (!process.env.VERCEL_API_TOKEN) {
      console.warn("VERCEL_API_TOKEN not found, using error data to indicate issue")
      
      // Return error data to indicate API issue
      const project = errorProjects.find(p => p.id === params.projectId)
      if (!project) {
        return NextResponse.json({ error: "⚠️ API Connection Failed - Project not found" }, { status: 404 })
      }

      const errorDeployments = {
        deployments: [
          {
            uid: project.lastDeployment.id,
            name: project.name,
            url: project.lastDeployment.url,
            created: new Date(project.lastDeployment.createdAt).getTime(),
            state: project.lastDeployment.state,
            target: project.lastDeployment.target,
            meta: {
              githubCommitRef: project.lastDeployment.branch,
              githubCommitMessage: project.lastDeployment.commit,
              githubCommitSha: project.lastDeployment.version,
            },
          },
        ],
      }
      return NextResponse.json(errorDeployments)
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
    console.error("Failed to fetch deployments from Vercel API:", error)
    
    // Return error data to clearly indicate API failure
    console.log("Returning error data to indicate API failure")
    const project = errorProjects.find(p => p.id === params.projectId)
    if (!project) {
      return NextResponse.json({ error: "⚠️ API Connection Failed - Project not found" }, { status: 404 })
    }

    const errorDeployments = {
      deployments: [
        {
          uid: project.lastDeployment.id,
          name: project.name,
          url: project.lastDeployment.url,
          created: new Date(project.lastDeployment.createdAt).getTime(),
          state: project.lastDeployment.state,
          target: project.lastDeployment.target,
          meta: {
            githubCommitRef: project.lastDeployment.branch,
            githubCommitMessage: project.lastDeployment.commit,
            githubCommitSha: project.lastDeployment.version,
          },
        },
      ],
    }
    return NextResponse.json(errorDeployments)
  }
}

// Utility functions for Vercel API integration

export interface VercelCronDefinition {
  path: string
  schedule: string
}

export interface VercelCrons {
  enabledAt?: number
  disabledAt?: number | null
  updatedAt?: number
  deploymentId?: string
  definitions: VercelCronDefinition[]
}

export interface VercelProject {
  id: string
  name: string
  framework?: string
  createdAt: number
  updatedAt: number
  targets?: {
    production?: {
      domain?: string
      url?: string
      alias?: string[]
      id?: string
      meta?: any
    }
  }
  crons?: VercelCrons
  latestDeployments?: VercelDeployment[]
}

export interface VercelDeployment {
  uid?: string
  id?: string
  name: string
  url: string
  created?: number
  createdAt?: number
  state?: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
  readyState?: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
  target: "production" | "staging" | "development"
  meta?: {
    // GitHub fields
    githubCommitRef?: string
    githubCommitMessage?: string
    githubCommitSha?: string
    githubCommitAuthorName?: string
    // GitLab fields
    gitlabCommitRef?: string
    gitlabCommitMessage?: string
    gitlabCommitSha?: string
    gitlabCommitAuthorName?: string
  }
}

export class VercelAPI {
  private apiToken: string
  private baseUrl = "https://api.vercel.com"

  constructor(apiToken: string) {
    this.apiToken = apiToken
  }

  private async request(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getProjects(): Promise<{ projects: VercelProject[] }> {
    return this.request("/v9/projects")
  }

  async getDeployments(projectId: string): Promise<{ deployments: VercelDeployment[] }> {
    return this.request(`/v6/deployments?projectId=${projectId}`)
  }

  async getProjectEnvironmentVariables(projectId: string) {
    return this.request(`/v9/projects/${projectId}/env`)
  }

  async getProjectDomains(projectId: string) {
    return this.request(`/v9/projects/${projectId}/domains`)
  }
}

// Usage example:
// const vercel = new VercelAPI(process.env.VERCEL_API_TOKEN!)
// const projects = await vercel.getProjects()

import { Project } from "./types"
import { VercelDeployment } from "./vercel-api"
import { VercelProject } from "./types"

/**
 * Extracts framework information from Vercel project data
 * @param vercelProject - The Vercel project data
 * @returns The framework name or "Unknown" if not available
 */
function extractFramework(vercelProject: VercelProject): string {
  return vercelProject.framework || "Unknown"
}

/**
 * Constructs the domain URL for a Vercel project
 * @param vercelProject - The Vercel project data
 * @returns The production domain, preferring custom domains over vercel.app subdomains
 */
function extractDomain(vercelProject: VercelProject): string {
  const aliases = vercelProject.targets?.production?.alias
  
  if (!aliases || aliases.length === 0) {
    return vercelProject.name ? `${vercelProject.name}.vercel.app` : 'unknown.vercel.app'
  }
  
  // Find first alias that doesn't include 'vercel.app'
  const customDomain = aliases.find(alias => !alias.includes('vercel.app'))
  
  // Return custom domain if found, otherwise fallback to first alias
  return customDomain || aliases[0]
}

/**
 * Transforms Vercel deployment data to our internal format
 * @param deployment - The Vercel deployment data
 * @param domain - The project domain for fallback URL
 * @returns Transformed deployment data
 */
function transformDeployment(deployment: VercelDeployment, domain: string) {
  return {
    id: deployment.uid || deployment.id || "unknown",
    url: deployment.url,
    createdAt: new Date(deployment.created || deployment.createdAt || Date.now()).toISOString(),
    state: deployment.state || deployment.readyState || "READY",
    target: deployment.target === "development" ? "develop" as const : deployment.target,
    branch: deployment.meta?.githubCommitRef || 
            deployment.meta?.gitlabCommitRef || 
            "unknown branch",
    commit: deployment.meta?.githubCommitMessage || 
            deployment.meta?.gitlabCommitMessage || 
            "unknown commit",
    version: (deployment.meta?.githubCommitSha || 
              deployment.meta?.gitlabCommitSha)?.substring(0, 7) || 
             "unknown version",
    triggeredBy: {
      name: deployment.meta?.githubCommitAuthorName || 
            deployment.meta?.gitlabCommitAuthorName || 
            "User unavailable in API",
      email: "Email unavailable in API",
      type: "git" as const
    }
  }
}

/**
 * Creates a fallback deployment when no deployment data is available
 * @param vercelProject - The Vercel project data
 * @param domain - The project domain
 * @returns Fallback deployment data
 */
function createFallbackDeployment(vercelProject: VercelProject, domain: string) {
  return {
    id: "unknown",
    url: `https://${domain}`,
    createdAt: new Date(vercelProject.createdAt).toISOString(),
    state: "READY" as const,
    target: "production" as const,
    branch: "main",
    commit: "No deployments",
    version: "v1.0.0",
    triggeredBy: {
      name: "User unavailable in API",
      email: "Email unavailable in API", 
      type: "git" as const
    }
  }
}

/**
 * Determines project status based on deployment state
 * @param deployment - The latest deployment data
 * @returns Project status string
 */
function determineProjectStatus(deployment?: VercelDeployment): "ready" | "building" | "error" | "queued" {
  if (!deployment) return "ready"
  
  switch (deployment.state) {
    case "READY": return "ready"
    case "BUILDING": return "building"
    case "ERROR": return "error"
    default: return "queued"
  }
}

/**
 * Transforms cron job definitions to our internal format
 * @param vercelProject - The Vercel project data
 * @returns Array of transformed cron jobs
 */
function transformCronJobs(vercelProject: VercelProject) {
  // Try the typed interface first
  if (vercelProject.crons?.definitions && Array.isArray(vercelProject.crons.definitions)) {
    return vercelProject.crons.definitions.map((cron: any, index: number) => ({
      id: `cron_${index + 1}`,
      name: cron.name || `Cron Job ${index + 1}`,
      schedule: cron.schedule || "0 0 * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(), // Mock next run (1 hour from now)
      lastRun: new Date(Date.now() - 3600000).toISOString(), // Mock last run (1 hour ago)
      status: vercelProject.crons?.disabledAt ? "inactive" as const : "active" as const,
      endpoint: cron.path || `/api/cron/${index + 1}`
    }))
  }
  
  // Fallback: try to access raw cron data
  const rawCrons = (vercelProject as any).crons
  if (rawCrons?.definitions && Array.isArray(rawCrons.definitions)) {
    return rawCrons.definitions.map((cron: any, index: number) => ({
      id: `cron_${index + 1}`,
      name: cron.name || `Cron Job ${index + 1}`,
      schedule: cron.schedule || "0 0 * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      lastRun: new Date(Date.now() - 3600000).toISOString(),
      status: rawCrons.disabledAt ? "inactive" as const : "active" as const,
      endpoint: cron.path || `/api/cron/${index + 1}`
    }))
  }
  
  return []
}

/**
 * Creates environment configurations for the project
 * @param vercelProject - The Vercel project data
 * @param domain - The project domain
 * @param lastDeployment - The last deployment data
 * @returns Environment configurations
 */
function createEnvironments(vercelProject: VercelProject, domain: string, lastDeployment: any) {
  return {
    production: {
      url: vercelProject.targets?.production?.url || `https://${domain}`,
      lastDeployed: new Date(vercelProject.updatedAt).toISOString(),
      version: lastDeployment.version,
      status: "active" as const,
      branch: "main" as const
    },
    develop: {
      url: `https://${vercelProject.name}-git-develop.vercel.app`,
      lastDeployed: new Date(vercelProject.updatedAt).toISOString(),
      version: "dev",
      status: "active" as const,
      branch: "develop" as const
    },
    staging: {
      url: `https://${vercelProject.name}-git-staging.vercel.app`,
      lastDeployed: new Date(vercelProject.updatedAt).toISOString(),
      version: "staging",
      status: "active" as const,
      branch: "staging" as const
    }
  }
}

/**
 * Determines the source code URL based on the project's git provider
 * @param vercelProject - The Vercel project data
 * @returns The source code URL
 */
function extractSourceCodeUrl(vercelProject: VercelProject): string {
  const link = (vercelProject as any).link
  
  if (!link) return ""
  
  // If it's a GitHub project, construct the GitHub URL
  if (link.type === 'github' && link.org && link.repo) {
    return `https://github.com/${link.org}/${link.repo}`
  }
  
  // Fallback to the project URL if available
  return link.projectUrl || ""
}

/**
 * Transforms Vercel project data to our internal Project format
 * @param vercelProject - The raw Vercel project data from API
 * @param latestDeployment - Optional latest deployment data
 * @returns Transformed Project object
 */
export function transformVercelProject(
  vercelProject: VercelProject,
  latestDeployment?: VercelDeployment
): Project {
  const framework = extractFramework(vercelProject)
  const domain = extractDomain(vercelProject)
  
  // Transform deployment data if available, otherwise create fallback
  const lastDeployment = latestDeployment 
    ? transformDeployment(latestDeployment, domain)
    : createFallbackDeployment(vercelProject, domain)

  const status = determineProjectStatus(latestDeployment)
  const cronJobs = transformCronJobs(vercelProject)
  const environments = createEnvironments(vercelProject, domain, lastDeployment)

  const projectData: Project = {
    id: vercelProject.id,
    name: vercelProject.name,
    framework,
    domain,
    nodeVersion: vercelProject.nodeVersion || "Unknown",
    status,
    projectUrl: `https://${domain}`,
    settingsUrl: `https://vercel.com/dashboard/project/${vercelProject.id}/settings`,
    sourceCodeUrl: extractSourceCodeUrl(vercelProject),
    lastDeployment,
    environments,
    cronJobs,
    versionInfo: {
      dependencies: {},
      devDependencies: {},
      buildCommand: "npm run build",
      outputDirectory: ".next",
      installCommand: "npm install"
    },
    analytics: {
      visitors: 0,
      requests: 0,
      bandwidth: "0 MB"
    }
  }

  // Only include rawData in local development environment
  if (process.env.NODE_ENV === 'development') {
    projectData.rawData = vercelProject
  }

  return projectData
}


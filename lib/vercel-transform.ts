import { Project, SanitizedVercelProject, ProjectWithSource } from "./types"
import { VercelDeployment } from "./vercel-api"
import { RawVercelProject } from "./types"

/**
 * Sanitizes Vercel project data by removing sensitive information
 * @param vercelProject - The raw Vercel project data from API
 * @returns Sanitized Vercel project data with sensitive information removed
 */
function sanitizeVercelProject(vercelProject: RawVercelProject): SanitizedVercelProject {
  const sanitized = { ...vercelProject }
  
  // Remove environment variables entirely
  delete sanitized.env
  
  // Redact sensitive IDs
  sanitized.accountId = "[REDACTED]"
  sanitized.id = "[REDACTED]"
  
  // Redact git credential ID
  if (sanitized.link) {
    sanitized.link = {
      ...sanitized.link,
      gitCredentialId: "[REDACTED]"
    }
  }
  
  // Remove deploy hook URLs
  if (sanitized.link?.deployHooks) {
    sanitized.link.deployHooks = sanitized.link.deployHooks.map(hook => ({
      ...hook,
      url: "[REDACTED]"
    }))
  }
  
  // Redact sensitive IDs in deployments
  if (sanitized.latestDeployments) {
    sanitized.latestDeployments = sanitized.latestDeployments.map(deployment => ({
      ...deployment,
      id: "[REDACTED]",
      teamId: "[REDACTED]",
      userId: "[REDACTED]",
      creator: {
        ...deployment.creator,
        uid: "[REDACTED]"
      }
    }))
  }
  
  // Redact sensitive IDs in targets
  if (sanitized.targets?.production) {
    sanitized.targets.production = {
      ...sanitized.targets.production,
      id: "[REDACTED]",
      teamId: "[REDACTED]",
      userId: "[REDACTED]",
      creator: {
        ...sanitized.targets.production.creator,
        uid: "[REDACTED]"
      }
    }
  }
  
  // Redact cron deployment ID
  if (sanitized.crons) {
    sanitized.crons = {
      ...sanitized.crons,
      deploymentId: "[REDACTED]"
    }
  }
  
  // Redact transfer account ID
  sanitized.transferredFromAccountId = "[REDACTED]"
  
  return sanitized
}

/**
 * Extracts framework information from Vercel project data
 * @param vercelProject - The Vercel project data
 * @returns The framework name or "Unknown" if not available
 */
function extractFramework(vercelProject: RawVercelProject): string {
  return vercelProject.framework || "Unknown"
}

/**
 * Constructs the domain URL for a Vercel project
 * @param vercelProject - The Vercel project data
 * @returns The production domain, preferring custom domains over vercel.app subdomains
 */
function extractDomain(vercelProject: RawVercelProject): string {
  const aliases = vercelProject.targets?.production?.alias
  const automaticAliases = vercelProject.targets?.production?.automaticAliases || []
  
  if (!aliases || aliases.length === 0) {
    return vercelProject.name ? `${vercelProject.name}.vercel.app` : 'unknown.vercel.app'
  }
  
  // Remove any alias found in automaticAliases
  const filteredAliases = aliases.filter(alias => !automaticAliases.includes(alias))
  
  // Check the length of the filtered array
  if (filteredAliases.length > 0) {
    // Continue with existing logic - find first alias that doesn't include 'vercel.app'
    const customDomain = filteredAliases.find(alias => !alias.includes('vercel.app'))
    
    // Return custom domain if found, otherwise fallback to first filtered alias
    return customDomain || filteredAliases[0]
  } else {
    // If no aliases remain after filtering, pick the shorter of the automaticAliases
    if (automaticAliases.length > 0) {
      return automaticAliases.reduce((shortest, current) => 
        current.length < shortest.length ? current : shortest
      )
    }
    
    // Fallback to first original alias if no automaticAliases
    return aliases[0]
  }
}

/**
 * Transforms Vercel deployment data to our internal format
 * @param deployment - The Vercel deployment data
 * @param domain - The project domain for fallback URL
 * @returns Transformed deployment data
 */
function transformDeployment(deployment: any, domain: string) {
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
function createFallbackDeployment(vercelProject: RawVercelProject, domain: string) {
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
function determineProjectStatus(deployment?: any): "ready" | "building" | "error" | "queued" {
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
function transformCronJobs(vercelProject: RawVercelProject) {
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
function createEnvironments(vercelProject: RawVercelProject, domain: string, lastDeployment: any) {
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
function extractSourceCodeUrl(vercelProject: RawVercelProject): string {
  const link = vercelProject.link
  
  if (!link) return ""
  
  // If it's a GitHub project, construct the GitHub URL
  if (link.type === 'github' && link.projectNamespace && link.projectName) {
    return `https://github.com/${link.projectNamespace}/${link.projectName}`
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
function transformToProject(vercelProject: RawVercelProject, latestDeployment?: any): Project {
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
    serverlessFunctionRegion: vercelProject.serverlessFunctionRegion || "Unknown",
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

  return projectData
}

/**
 * Main transformation function that returns both sanitized source and transformed data
 * @param vercelProject - The raw Vercel project data from API
 * @param latestDeployment - Optional latest deployment data
 * @returns Object containing both sanitized source and transformed data
 */
export function transformVercelProject(
  vercelProject: RawVercelProject,
  latestDeployment?: any
): ProjectWithSource {
  const sanitized = sanitizeVercelProject(vercelProject)
  const transformed = transformToProject(vercelProject, latestDeployment)
  
  return {
    source: sanitized,
    transformed
  }
}


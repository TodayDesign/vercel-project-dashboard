import { Project } from "./types"
import { VercelProject, VercelDeployment } from "./vercel-api"

export function transformVercelProject(
  vercelProject: VercelProject,
  latestDeployment?: VercelDeployment
): Project {
  // Extract framework from project data
  const framework = vercelProject.framework || "Unknown"
  
  // Get domain from targets or construct from name
  const domain = vercelProject.targets?.production?.domain || 
                 `${vercelProject.name}.vercel.app`

  // Transform deployment data if available
  const lastDeployment = latestDeployment ? {
    id: latestDeployment.uid || latestDeployment.id || "unknown",
    url: latestDeployment.url,
    createdAt: new Date(latestDeployment.created || latestDeployment.createdAt || Date.now()).toISOString(),
    state: latestDeployment.state || latestDeployment.readyState || "READY",
    target: latestDeployment.target === "development" ? "develop" as const : latestDeployment.target,
    // Handle both GitHub and GitLab commit refs
    branch: latestDeployment.meta?.githubCommitRef || 
            latestDeployment.meta?.gitlabCommitRef || 
            "unknown branch",
    // Handle both GitHub and GitLab commit messages
    commit: latestDeployment.meta?.githubCommitMessage || 
            latestDeployment.meta?.gitlabCommitMessage || 
            "unknown commit",
    // Handle both GitHub and GitLab commit SHAs
    version: (latestDeployment.meta?.githubCommitSha || 
              latestDeployment.meta?.gitlabCommitSha)?.substring(0, 7) || 
             "unknown version",
    triggeredBy: {
      // Handle both GitHub and GitLab author names
      name: latestDeployment.meta?.githubCommitAuthorName || 
            latestDeployment.meta?.gitlabCommitAuthorName || 
            "User unavailable in API",
      email: "Email unavailable in API",
      type: "git" as const
    }
  } : {
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

  // Determine project status based on latest deployment
  const status = latestDeployment ? 
    (latestDeployment.state === "READY" ? "ready" :
     latestDeployment.state === "BUILDING" ? "building" :
     latestDeployment.state === "ERROR" ? "error" : "queued") : "ready"

  // Enhanced cron jobs transformation with fallback
  const cronJobs = (() => {
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
  })()

  return {
    id: vercelProject.id,
    name: vercelProject.name,
    framework,
    domain,
    nodeVersion: "18.x", // Default, Vercel API doesn't provide this
    status,
    projectUrl: `https://${domain}`,
    settingsUrl: `https://vercel.com/dashboard/project/${vercelProject.id}/settings`,
    sourceCodeUrl: (vercelProject as any).link?.projectUrl || "",
    lastDeployment,
    environments: {
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
    },
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
    },
    rawData: vercelProject
  }
}
import { AlertCircle, CheckCircle, Clock, Activity, GitBranch, User, Zap, Terminal } from "lucide-react"
import { Project, VercelProject } from "./types"

export function getStatusIcon(status: string) {
  switch (status) {
    case "ready":
    case "READY":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "building":
    case "BUILDING":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "error":
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "queued":
    case "QUEUED":
      return <Clock className="h-4 w-4 text-blue-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "ready":
    case "READY":
      return "bg-green-100 text-green-800 border-green-200"
    case "building":
    case "BUILDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "error":
    case "ERROR":
      return "bg-red-100 text-red-800 border-red-200"
    case "queued":
    case "QUEUED":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getTriggerTypeIcon(type: string) {
  switch (type) {
    case "git":
      return <GitBranch className="h-3 w-3" />
    case "manual":
      return <User className="h-3 w-3" />
    case "webhook":
      return <Zap className="h-3 w-3" />
    case "api":
      return <Terminal className="h-3 w-3" />
    default:
      return <Activity className="h-3 w-3" />
  }
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

export function formatCronSchedule(schedule: string) {
  const cronDescriptions: { [key: string]: string } = {
    "0 2 * * *": "Daily at 2:00 AM",
    "0 9 * * 1": "Weekly on Monday at 9:00 AM",
    "*/30 * * * *": "Every 30 minutes",
    "0 1 * * *": "Daily at 1:00 AM",
    "*/5 * * * *": "Every 5 minutes",
  }
  return cronDescriptions[schedule] || schedule
}

/**
 * Convert VercelProject data to Project interface with proper URLs
 */
export function convertVercelProjectToProject(vercelProject: VercelProject): Project {
  // Get the latest production deployment
  const latestProductionDeployment = vercelProject.latestDeployments.find(
    deployment => deployment.target === "production"
  ) || vercelProject.latestDeployments[0]

  // Get the production URL - prefer custom domain over Vercel domain
  const productionUrl = latestProductionDeployment?.alias.find(alias => 
    !alias.includes('.vercel.app') && !alias.includes('git-main')
  ) || latestProductionDeployment?.alias[0] || latestProductionDeployment?.url

  // Construct the project URL (add https if not present)
  const projectUrl = productionUrl?.startsWith('http') 
    ? productionUrl 
    : `https://${productionUrl}`

  // Construct the settings URL using the owner and project name from oidcTokenClaims
  const owner = latestProductionDeployment?.oidcTokenClaims?.owner || 'unknown'
  const projectName = vercelProject.name
  const settingsUrl = `https://vercel.com/${owner}/${projectName}/settings`

  // Get commit information from the latest deployment
  const commitInfo = latestProductionDeployment?.meta
  const commitSha = commitInfo?.gitlabCommitSha || commitInfo?.githubCommitSha || 'unknown'
  const commitMessage = commitInfo?.gitlabCommitMessage || commitInfo?.githubCommitMessage || 'No commit message'
  const commitAuthor = commitInfo?.gitlabCommitAuthorName || commitInfo?.githubCommitAuthorName || 'Unknown'
  const commitRef = commitInfo?.gitlabCommitRef || commitInfo?.githubCommitRef || 'main'

  // Get branch information
  const branch = commitRef || vercelProject.link.productionBranch || 'main'

  return {
    id: vercelProject.id,
    name: vercelProject.name,
    framework: vercelProject.framework,
    domain: productionUrl || 'No domain',
    nodeVersion: vercelProject.nodeVersion,
    status: mapVercelStatus(vercelProject.live ? 'ready' : 'error'),
    projectUrl,
    settingsUrl,
    sourceCodeUrl: vercelProject.link.projectUrl,
    lastDeployment: {
      id: latestProductionDeployment?.id || 'unknown',
      url: latestProductionDeployment?.url || '',
      createdAt: new Date(latestProductionDeployment?.createdAt || 0).toISOString(),
      state: latestProductionDeployment?.readyState || 'ERROR',
      target: 'production',
      branch,
      commit: commitSha,
      version: commitSha.substring(0, 8),
      triggeredBy: {
        name: latestProductionDeployment?.creator?.username || commitAuthor,
        email: latestProductionDeployment?.creator?.email || 'unknown@example.com',
        type: 'git'
      }
    },
    environments: {
      production: {
        url: projectUrl,
        lastDeployed: new Date(latestProductionDeployment?.readyAt || 0).toISOString(),
        version: commitSha.substring(0, 8),
        status: latestProductionDeployment?.readyState === 'READY' ? 'active' : 'inactive',
        branch: 'main'
      },
      develop: {
        url: projectUrl.replace('https://', 'https://dev-'),
        lastDeployed: new Date().toISOString(),
        version: 'dev',
        status: 'inactive',
        branch: 'develop'
      },
      staging: {
        url: projectUrl.replace('https://', 'https://staging-'),
        lastDeployed: new Date().toISOString(),
        version: 'staging',
        status: 'inactive',
        branch: 'staging'
      }
    },
    cronJobs: vercelProject.crons.definitions.map((cron, index) => ({
      id: `cron-${index}`,
      name: `Cron Job ${index + 1}`,
      schedule: '0 0 * * *', // Default daily schedule
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastRun: new Date().toISOString(),
      status: vercelProject.crons.disabledAt ? 'inactive' : 'active',
      endpoint: `/api/cron/${index}`
    })),
    versionInfo: {
      dependencies: {},
      devDependencies: {},
      buildCommand: vercelProject.buildCommand || 'npm run build',
      outputDirectory: vercelProject.outputDirectory || '.next',
      installCommand: vercelProject.installCommand || 'npm install'
    },
    analytics: {
      visitors: Math.floor(Math.random() * 10000),
      requests: Math.floor(Math.random() * 50000),
      bandwidth: '1.2 GB'
    },
    rawData: vercelProject
  }
}

/**
 * Map Vercel status to our status format
 */
function mapVercelStatus(status: string): "ready" | "building" | "error" | "queued" {
  switch (status) {
    case 'ready':
      return 'ready'
    case 'building':
      return 'building'
    case 'error':
      return 'error'
    case 'queued':
      return 'queued'
    default:
      return 'error'
  }
}
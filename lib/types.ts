// Vercel API Project interface based on the example data
export interface VercelProject {
  accountId: string
  id: string
  name: string
  framework: string
  nodeVersion: string
  createdAt: number
  updatedAt: number
  live: boolean
  
  // Build configuration
  buildCommand: string | null
  devCommand: string | null
  installCommand: string | null
  outputDirectory: string | null
  rootDirectory: string | null
  
  // Git repository information
  link: {
    type: "github" | "gitlab"
    projectId: string
    projectName: string
    projectNameWithNamespace: string
    projectNamespace: string
    projectUrl: string
    gitCredentialId: string
    productionBranch: string
    createdAt: number
    updatedAt: number
    deployHooks: {
      createdAt: number
      id: string
      name: string
      ref: string
      url: string
    }[]
  }
  
  // Latest deployments
  latestDeployments: {
    id: string
    name: string
    url: string
    createdAt: number
    readyAt: number
    buildingAt: number
    target: "production" | "preview"
    readyState: "READY" | "BUILDING" | "ERROR" | "QUEUED" | "INITIALIZING" | "CANCELED"
    readySubstate: string
    alias: string[]
    automaticAliases: string[]
    aliasAssigned: number
    aliasError: string | null
    deploymentHostname: string
    forced: boolean
    createdIn: string
    creator: {
      uid: string
      email: string
      username: string
    }
    meta: {
      gitlabCommitAuthorName?: string
      gitlabCommitMessage?: string
      gitlabCommitRef?: string
      gitlabCommitSha?: string
      gitlabProjectName?: string
      gitlabProjectNamespace?: string
      gitlabProjectPath?: string
      gitlabProjectRepo?: string
      gitlabNamespaceKind?: string
      gitlabProjectId?: string
      gitlabCommitRawAuthorEmail?: string
      gitlabProjectVisibility?: string
      githubCommitAuthorName?: string
      githubCommitMessage?: string
      githubCommitRef?: string
      githubCommitSha?: string
      githubProjectName?: string
      githubProjectNamespace?: string
      githubProjectPath?: string
      githubProjectRepo?: string
      githubNamespaceKind?: string
      githubProjectId?: string
      githubCommitRawAuthorEmail?: string
      githubProjectVisibility?: string
      deployHookId?: string
      deployHookRef?: string
      deployHookName?: string
      branchAlias?: string
    }
    plan: string
    private: boolean
    teamId: string
    type: string
    userId: string
    withCache: boolean
    previewCommentsEnabled: boolean
    oidcTokenClaims: {
      sub: string
      iss: string
      scope: string
      aud: string
      owner: string
      owner_id: string
      project: string
      project_id: string
      environment: string
    }
  }[]
  
  // Production targets
  targets: {
    production: {
      id: string
      name: string
      url: string
      createdAt: number
      readyAt: number
      buildingAt: number
      target: "production"
      readyState: "READY" | "BUILDING" | "ERROR" | "QUEUED" | "INITIALIZING" | "CANCELED"
      readySubstate: string
      alias: string[]
      automaticAliases: string[]
      aliasAssigned: number
      aliasError: string | null
      deploymentHostname: string
      forced: boolean
      createdIn: string
      creator: {
        uid: string
        email: string
        username: string
      }
      meta: {
        gitlabCommitAuthorName?: string
        gitlabCommitMessage?: string
        gitlabCommitRef?: string
        gitlabCommitSha?: string
        gitlabProjectName?: string
        gitlabProjectNamespace?: string
        gitlabProjectPath?: string
        gitlabProjectRepo?: string
        gitlabNamespaceKind?: string
        gitlabProjectId?: string
        gitlabCommitRawAuthorEmail?: string
        gitlabProjectVisibility?: string
        githubCommitAuthorName?: string
        githubCommitMessage?: string
        githubCommitRef?: string
        githubCommitSha?: string
        githubProjectName?: string
        githubProjectNamespace?: string
        githubProjectPath?: string
        githubProjectRepo?: string
        githubNamespaceKind?: string
        githubProjectId?: string
        githubCommitRawAuthorEmail?: string
        githubProjectVisibility?: string
        deployHookId?: string
        deployHookRef?: string
        deployHookName?: string
        branchAlias?: string
      }
      plan: string
      private: boolean
      teamId: string
      type: string
      userId: string
      withCache: boolean
      previewCommentsEnabled: boolean
      oidcTokenClaims: {
        sub: string
        iss: string
        scope: string
        aud: string
        owner: string
        owner_id: string
        project: string
        project_id: string
        environment: string
      }
    }
  }
  
  // Cron jobs
  crons: {
    enabledAt: number
    disabledAt: number | null
    updatedAt: number
    deploymentId: string
    definitions: any[]
  }
  
  // Environment variables
  env: {
    target: string[]
    configurationId: string | null
    id: string
    key: string
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy: string | null
    type: string
    value: string
    customEnvironmentIds: string[]
  }[]
  
  // Other configuration
  autoExposeSystemEnvs: boolean
  autoAssignCustomDomains: boolean
  autoAssignCustomDomainsUpdatedBy: string
  gitForkProtection: boolean
  gitLFS: boolean
  lastRollbackTarget: any
  lastAliasRequest: any
  passwordProtection: any
  publicSource: any
  serverlessFunctionRegion: string
  sourceFilesOutsideRootDirectory: boolean
  transferStartedAt: number
  transferCompletedAt: number
  transferredFromAccountId: string
  
  // Resource configuration
  defaultResourceConfig: {
    fluid: boolean
    functionDefaultRegions: string[]
    functionDefaultTimeout: number
    functionDefaultMemoryType: string
    functionZeroConfigFailover: boolean
    elasticConcurrencyEnabled: boolean
  }
  resourceConfig: {
    functionDefaultRegions: string[]
    functionDefaultMemoryType: string
  }
  
  // Git comments
  gitComments: {
    onCommit: boolean
    onPullRequest: boolean
  }
  
  // Web analytics
  webAnalytics: {
    id: string
  }
  
  // Speed insights
  speedInsights: {
    id: string
    hasData: boolean
  }
  
  // Features
  features: {
    webAnalytics: boolean
  }
}

// Legacy Project interface for backward compatibility
export interface Project {
  id: string
  name: string
  framework: string
  domain: string
  nodeVersion: string
  status: "ready" | "building" | "error" | "queued"
  // Add URLs for project links
  projectUrl: string // Production URL for viewing the project
  settingsUrl: string // Vercel dashboard settings URL
  sourceCodeUrl: string // Source code repository URL
  lastDeployment: {
    id: string
    url: string
    createdAt: string
    state: "READY" | "BUILDING" | "ERROR" | "QUEUED" | "INITIALIZING" | "CANCELED"
    target: "production" | "develop" | "staging"
    branch: string
    commit: string
    version: string
    triggeredBy: {
      name: string
      email: string
      type: "git" | "manual" | "webhook" | "api"
    }
  }
  environments: {
    production: {
      url: string
      lastDeployed: string
      version: string
      status: "active" | "inactive"
      branch: "main"
    }
    develop: {
      url: string
      lastDeployed: string
      version: string
      status: "active" | "inactive"
      branch: "develop"
    }
    staging: {
      url: string
      lastDeployed: string
      version: string
      status: "active" | "inactive"
      branch: "staging"
    }
  }
  cronJobs: {
    id: string
    name: string
    schedule: string
    nextRun: string
    lastRun: string
    status: "active" | "inactive"
    endpoint: string
  }[]
  versionInfo: {
    dependencies: {
      [key: string]: string
    }
    devDependencies: {
      [key: string]: string
    }
    buildCommand: string
    outputDirectory: string
    installCommand: string
  }
  analytics: {
    visitors: number
    requests: number
    bandwidth: string
  }
  rawData?: any // Raw Vercel API response for debugging
}
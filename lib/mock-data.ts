import { ProjectWithSource, SanitizedVercelProject } from "./types"

// Create mock sanitized Vercel project data
const createMockSanitizedProject = (id: string, name: string): SanitizedVercelProject => ({
  accountId: "[REDACTED]",
  speedInsights: {
    id: `speed_${id}`,
    hasData: true
  },
  autoExposeSystemEnvs: true,
  autoAssignCustomDomains: true,
  autoAssignCustomDomainsUpdatedBy: "system",
  buildCommand: "npm run build",
  createdAt: Date.now() - 86400000 * 30, // 30 days ago
  crons: {
    enabledAt: Date.now() - 86400000 * 7,
    disabledAt: null,
    updatedAt: Date.now() - 86400000,
    deploymentId: "[REDACTED]",
    definitions: []
  },
  devCommand: "npm run dev",
  directoryListing: false,
  framework: "nextjs",
  gitForkProtection: true,
  gitLFS: false,
  id: "[REDACTED]",
  installCommand: "npm install",
  lastRollbackTarget: null,
  lastAliasRequest: null,
  name,
  nodeVersion: "18.x",
  outputDirectory: ".next",
  passwordProtection: null,
  publicSource: null,
  defaultResourceConfig: {
    fluid: false,
    functionDefaultRegions: ["iad1"],
    functionDefaultTimeout: 300,
    functionDefaultMemoryType: "standard_legacy",
    functionZeroConfigFailover: false,
    elasticConcurrencyEnabled: false
  },
  resourceConfig: {
    functionDefaultRegions: ["iad1"],
    functionDefaultMemoryType: "standard_legacy"
  },
  rootDirectory: null,
  serverlessFunctionRegion: "iad1",
  sourceFilesOutsideRootDirectory: true,
  updatedAt: Date.now() - 86400000,
  live: true,
  gitComments: {
    onCommit: false,
    onPullRequest: true
  },
  webAnalytics: {
    id: `analytics_${id}`
  },
  link: {
    type: "github" as const,
    projectId: `proj_${id}`,
    projectName: name,
    projectNameWithNamespace: `mockuser/${name}`,
    projectNamespace: "mockuser",
    projectUrl: `https://github.com/mockuser/${name}`,
    gitCredentialId: "[REDACTED]",
    productionBranch: "main",
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
    deployHooks: [
      {
        createdAt: Date.now() - 86400000 * 30,
        id: `hook_${id}`,
        name: "GitHub",
        ref: "main",
        url: "[REDACTED]"
      }
    ]
  },
  latestDeployments: [
    {
      alias: [`${name}.vercel.app`, `${name}-git-main.vercel.app`],
      aliasAssigned: Date.now() - 86400000,
      aliasError: null,
      automaticAliases: [`${name}-git-main.vercel.app`],
      builds: [],
      createdAt: Date.now() - 86400000,
      createdIn: "sfo1",
      creator: {
        uid: "[REDACTED]",
        email: "user@example.com",
        username: "mockuser"
      },
      deploymentHostname: `${name}-mock123.vercel.app`,
      forced: false,
      id: "[REDACTED]",
      meta: {
        githubCommitAuthorName: "Mock User",
        githubCommitMessage: "feat: add new features",
        githubCommitRef: "main",
        githubCommitSha: "abc123def456",
        githubProjectName: name,
        githubProjectNamespace: "mockuser",
        githubProjectPath: `mockuser/${name}`,
        githubProjectRepo: name,
        githubNamespaceKind: "user",
        githubProjectId: `proj_${id}`,
        githubCommitRawAuthorEmail: "user@example.com",
        githubProjectVisibility: "public",
        deployHookId: `hook_${id}`,
        deployHookRef: "main",
        deployHookName: "GitHub",
        branchAlias: `${name}-git-main.vercel.app`
      },
      name,
      plan: "hobby",
      private: false,
      readyState: "READY" as const,
      readySubstate: "PROMOTED",
      target: "production" as const,
      teamId: "[REDACTED]",
      type: "LAMBDAS",
      url: `https://${name}-mock123.vercel.app`,
      userId: "[REDACTED]",
      withCache: true,
      buildingAt: Date.now() - 86400000,
      readyAt: Date.now() - 86400000,
      previewCommentsEnabled: true,
      oidcTokenClaims: {
        sub: "[REDACTED]",
        iss: "https://oidc.vercel.com/team_mock123",
        scope: `owner:team_mock123:project:${name}:environment:production`,
        aud: "https://vercel.com/team_mock123",
        owner: "[REDACTED]",
        owner_id: "[REDACTED]",
        project: name,
        project_id: "[REDACTED]",
        environment: "production"
      }
    }
  ],
  targets: {
    production: {
      alias: [`${name}.vercel.app`, `${name}-git-main.vercel.app`],
      aliasAssigned: Date.now() - 86400000,
      aliasError: null,
      automaticAliases: [`${name}-git-main.vercel.app`],
      builds: [],
      createdAt: Date.now() - 86400000,
      createdIn: "sfo1",
      creator: {
        uid: "[REDACTED]",
        email: "user@example.com",
        username: "mockuser"
      },
      deploymentHostname: `${name}-mock123.vercel.app`,
      forced: false,
      id: "[REDACTED]",
      meta: {
        githubCommitAuthorName: "Mock User",
        githubCommitMessage: "feat: add new features",
        githubCommitRef: "main",
        githubCommitSha: "abc123def456",
        githubProjectName: name,
        githubProjectNamespace: "mockuser",
        githubProjectPath: `mockuser/${name}`,
        githubProjectRepo: name,
        githubNamespaceKind: "user",
        githubProjectId: `proj_${id}`,
        githubCommitRawAuthorEmail: "user@example.com",
        githubProjectVisibility: "public",
        deployHookId: `hook_${id}`,
        deployHookRef: "main",
        deployHookName: "GitHub",
        branchAlias: `${name}-git-main.vercel.app`
      },
      name,
      plan: "hobby",
      private: false,
      readyState: "READY" as const,
      readySubstate: "PROMOTED",
      target: "production" as const,
      teamId: "[REDACTED]",
      type: "LAMBDAS",
      url: `https://${name}-mock123.vercel.app`,
      userId: "[REDACTED]",
      withCache: true,
      buildingAt: Date.now() - 86400000,
      readyAt: Date.now() - 86400000,
      previewCommentsEnabled: true,
      oidcTokenClaims: {
        sub: "[REDACTED]",
        iss: "https://oidc.vercel.com/team_mock123",
        scope: `owner:team_mock123:project:${name}:environment:production`,
        aud: "https://vercel.com/team_mock123",
        owner: "[REDACTED]",
        owner_id: "[REDACTED]",
        project: name,
        project_id: "[REDACTED]",
        environment: "production"
      }
    }
  },
  transferStartedAt: 0,
  transferCompletedAt: 0,
  transferredFromAccountId: "[REDACTED]",
  features: {
    webAnalytics: true
  }
})

// Create mock transformed project data
const createMockTransformedProject = (id: string, name: string, framework: string, status: "ready" | "building" | "error" | "queued") => ({
  id,
  name,
  framework,
  domain: `${name}.vercel.app`,
  nodeVersion: "18.x",
  status,
  projectUrl: `https://${name}.vercel.app`,
  settingsUrl: `https://vercel.com/dashboard/project/${id}/settings`,
  sourceCodeUrl: `https://github.com/mockuser/${name}`,
  lastDeployment: {
    id: `dpl_${id}`,
    url: `https://${name}-git-main.vercel.app`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    state: status === "ready" ? "READY" as const : status === "building" ? "BUILDING" as const : "ERROR" as const,
    target: "production" as const,
    branch: "main",
    commit: "feat: add new features",
    version: "v1.2.3",
    triggeredBy: {
      name: "Mock User",
      email: "user@example.com",
      type: "git" as const
    }
  },
  environments: {
    production: {
      url: `https://${name}.vercel.app`,
      lastDeployed: new Date(Date.now() - 86400000).toISOString(),
      version: "v1.2.3",
      status: "active" as const,
      branch: "main" as const
    },
    develop: {
      url: `https://${name}-git-develop.vercel.app`,
      lastDeployed: new Date(Date.now() - 86400000 * 2).toISOString(),
      version: "v1.2.4-dev.1",
      status: "active" as const,
      branch: "develop" as const
    },
    staging: {
      url: `https://${name}-git-staging.vercel.app`,
      lastDeployed: new Date(Date.now() - 86400000 * 3).toISOString(),
      version: "v1.2.3-rc.2",
      status: "active" as const,
      branch: "staging" as const
    }
  },
  cronJobs: [
    {
      id: "cron_1",
      name: "Daily Backup",
      schedule: "0 2 * * *",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      lastRun: new Date(Date.now() - 86400000).toISOString(),
      status: "active" as const,
      endpoint: "/api/backup"
    }
  ],
  versionInfo: {
    dependencies: {
      next: "14.0.4",
      react: "18.2.0",
      "react-dom": "18.2.0"
    },
    devDependencies: {
      "@types/node": "20.10.5",
      "@types/react": "18.2.45",
      typescript: "5.3.3"
    },
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm ci"
  },
  analytics: {
    visitors: 1250,
    requests: 5420,
    bandwidth: "2.1 GB"
  }
})

export const mockProjects: ProjectWithSource[] = [
  {
    source: createMockSanitizedProject("1", "my-nextjs-app"),
    transformed: createMockTransformedProject("1", "my-nextjs-app", "Next.js", "ready")
  },
  {
    source: createMockSanitizedProject("2", "portfolio-site"),
    transformed: createMockTransformedProject("2", "portfolio-site", "React", "building")
  },
  {
    source: createMockSanitizedProject("3", "api-service"),
    transformed: createMockTransformedProject("3", "api-service", "Node.js", "error")
  }
]

export const errorProjects: ProjectWithSource[] = [
  {
    source: createMockSanitizedProject("error_1", "error-project"),
    transformed: createMockTransformedProject("error_1", "error-project", "Unknown", "error")
  }
]
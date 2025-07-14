import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ExternalLink,
  GitBranch,
  Globe,
  MoreHorizontal,
  Settings,
  Play,
  Pause,
  FileText,
  Package,
  Terminal,
  Folder,
  Download,
  Clock,
  TreePine,
  MessageSquare,
  Activity,
  Loader2,
} from "lucide-react"
import { ProjectWithSource } from "@/lib/types"
import { getStatusIcon, getStatusColor, getTriggerTypeIcon, formatDate, formatCronSchedule } from "@/lib/project-utils"
import React, { useEffect, useState } from "react"

// Global ping queue to stagger calls
let pingQueue: (() => Promise<void>)[] = []
let isProcessingQueue = false

const processPingQueue = async () => {
  if (isProcessingQueue || pingQueue.length === 0) return
  
  isProcessingQueue = true
  
  while (pingQueue.length > 0) {
    const pingTask = pingQueue.shift()
    if (pingTask) {
      await pingTask()
    }
  }
  
  isProcessingQueue = false
}

const addToPingQueue = (pingTask: () => Promise<void>) => {
  pingQueue.push(pingTask)
  processPingQueue()
}

// Helper function to get status text color that matches the icon
const getStatusTextColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ready":
      return "text-green-500"
    case "building":
      return "text-yellow-500"
    case "error":
      return "text-red-500"
    case "queued":
      return "text-blue-500"
    default:
      return "text-gray-500"
  }
}

// Framework icons
const NextJsIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 4.317 8.292 8.918 9.695.779.234 1.62.422 2.748.528.302.028.394.034 1.233.034.839 0 .931-.006 1.233-.034 1.128-.106 1.969-.294 2.748-.528 4.601-1.403 8.266-5.189 8.918-9.695.096-.659.108-.854.108-1.748s-.012-1.089-.108-1.748c-.652-4.506-4.317-8.292-8.918-9.695a19.76 19.76 0 0 0-.364-.033C11.882.001 11.748 0 11.572 0zM9.375 1.515c.234.021.435.041.525.051 2.189.234 4.154 1.201 5.625 2.695 1.47 1.494 2.218 3.518 2.218 5.739s-.748 4.245-2.218 5.739c-1.471 1.494-3.436 2.461-5.625 2.695-.09.01-.291.03-.525.051-.234-.021-.435-.041-.525-.051-2.189-.234-4.154-1.201-5.625-2.695C2.748 13.245 2 11.221 2 9s.748-4.245 2.218-5.739c1.471-1.494 3.436-2.461 5.625-2.695.09-.01.291-.03.525-.051h.007z"/>
    <path d="M16.518 7.025c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033c-2.189.234-4.154 1.201-5.625 2.695C8.748 11.245 8 13.269 8 15.49s.748 4.245 2.218 5.739c1.471 1.494 3.436 2.461 5.625 2.695.09.01.291.03.525.051.234-.021.435-.041.525-.051 2.189-.234 4.154-1.201 5.625-2.695C23.252 19.735 24 17.711 24 15.49s-.748-4.245-2.218-5.739c-1.471-1.494-3.436-2.461-5.625-2.695a19.76 19.76 0 0 0-.364-.033C16.828 7.001 16.694 7 16.518 7z"/>
  </svg>
)

const VueJsIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/>
  </svg>
)

const NodeJsIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.998,24c-0.321,0 -0.641,-0.084 -0.922,-0.247l-2.936,-1.737c-0.438,-0.245 -0.224,-0.332 -0.08,-0.383c0.585,-0.203 0.703,-0.25 1.328,-0.604c0.065,-0.037 0.151,-0.023 0.218,0.017l2.256,1.339c0.082,0.045 0.197,0.045 0.272,0l8.795,-5.076c0.082,-0.047 0.134,-0.141 0.134,-0.238V6.921c0,-0.099 -0.053,-0.192 -0.137,-0.242l-8.791,-5.072c-0.081,-0.047 -0.189,-0.047 -0.271,0L3.075,6.68C2.99,6.729 2.936,6.825 2.936,6.921v10.15c0,0.097 0.054,0.189 0.139,0.235l2.409,1.392c1.307,0.654 2.108,-0.116 2.108,-0.89V7.787c0,-0.142 0.114,-0.253 0.256,-0.253h1.115c0.139,0 0.255,0.112 0.255,0.253v10.021c0,1.745 -0.95,2.745 -2.604,2.745c-0.508,0 -0.909,0 -2.026,-0.551L2.28,18.675c-0.57,-0.329 -0.922,-0.945 -0.922,-1.604V6.921c0,-0.659 0.353,-1.275 0.922,-1.603l8.795,-5.082c0.557,-0.315 1.296,-0.315 1.848,0l8.794,5.082c0.57,0.329 0.924,0.944 0.924,1.603v10.15c0,0.659 -0.354,1.273 -0.924,1.604l-8.794,5.078c-0.286,0.164 -0.606,0.248 -0.922,0.248Zm-0.996,-7.151c-0.142,0 -0.254,0.112 -0.254,0.253v1.636c0,0.141 0.113,0.253 0.254,0.253h1.117c0.141,0 0.254,-0.112 0.254,-0.253v-1.636c0,-0.141 -0.113,-0.253 -0.254,-0.253h-1.117Z"/>
  </svg>
)

// Framework lookup map
const frameworkConfig = {
  nextjs: {
    formattedName: "NextJS",
    icon: NextJsIcon,
  },
  vue: {
    formattedName: "VueJS", 
    icon: VueJsIcon,
  },
  vuejs: {
    formattedName: "VueJS",
    icon: VueJsIcon,
  },
  // Add more frameworks as needed
}

// Helper function to get framework config
const getFrameworkConfig = (framework: string) => {
  const normalizedFramework = framework.toLowerCase().replace(/[^a-z0-9]/g, '')
  return frameworkConfig[normalizedFramework as keyof typeof frameworkConfig] || {
    formattedName: framework,
    icon: Package,
  }
}

interface EnhancedProjectCardProps {
  project: ProjectWithSource
}

export function EnhancedProjectCard({ project }: EnhancedProjectCardProps) {
  // Use the transformed data for display
  const { transformed, source } = project
  
  // Get available targets from source data
  const availableTargets = source.targets ? Object.keys(source.targets) : ['production']
  
  // Helper function to get target display name
  const getTargetDisplayName = (target: string) => {
    switch (target) {
      case 'production': return 'Prod'
      case 'preview': return 'Preview'
      case 'development': return 'Dev'
      default: return target.charAt(0).toUpperCase() + target.slice(1)
    }
  }
  
  // Helper function to get environment data for a target
  const getEnvironmentData = (target: string) => {
    // Try to get from transformed environments first
    if (transformed.environments[target as keyof typeof transformed.environments]) {
      return transformed.environments[target as keyof typeof transformed.environments]
    }
    
    // Fallback to source targets data
    const targetData = source.targets?.[target as keyof typeof source.targets]
    if (targetData) {
      return {
        url: targetData.url || `https://${transformed.domain}`,
        lastDeployed: new Date(targetData.createdAt).toISOString(),
        version: targetData.meta?.githubCommitSha?.substring(0, 7) || 'unknown',
        status: targetData.readyState === 'READY' ? 'active' as const : 'inactive' as const,
        branch: targetData.meta?.githubCommitRef || targetData.meta?.gitlabCommitRef || 'unknown'
      }
    }
    
    // Default fallback
    return {
      url: `https://${transformed.domain}`,
      lastDeployed: new Date().toISOString(),
      version: 'unknown',
      status: 'inactive' as const,
      branch: 'unknown'
    }
  }

  // Latency state for API-based ping test
  const [latency, setLatency] = useState<string | null>(null)
  const [isPinging, setIsPinging] = useState(false)

  useEffect(() => {
    let isMounted = true
    
    const pingTask = async () => {
      if (!isMounted) return
      
      setIsPinging(true)
      
      try {
        const response = await fetch('/api/ping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain: transformed.domain }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Ensure minimum 0.5s loading state
          const minDelay = 500
          const actualDelay = Math.max(0, minDelay - data.latency)
          
          if (actualDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, actualDelay))
          }
          
          if (isMounted) {
            setLatency(`${data.latency}ms`)
          }
        } else {
          // Even on error, maintain minimum 0.5s loading state
          await new Promise(resolve => setTimeout(resolve, 500))
          
          if (isMounted) {
            setLatency("n/a")
          }
        }
      } catch (error) {
        // Even on error, maintain minimum 0.5s loading state
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (isMounted) {
          setLatency("n/a")
        }
      } finally {
        if (isMounted) {
          setIsPinging(false)
        }
      }
    }
    
    addToPingQueue(pingTask)
    
    return () => { 
      isMounted = false 
    }
  }, [transformed.domain])
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Header - Project Name, Domain, Source Code */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{transformed.name}</CardTitle>
            <CardDescription className="w-full">
              <div className="flex items-center gap-2">
                <a 
                  href={`https://${transformed.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-500 hover:text-gray-600 flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  Public Site
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={`https://${transformed.sourceCodeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-500 hover:text-gray-600 flex items-center gap-1"
                >
                  <GitBranch className="h-4 w-4" />
                  Source Code
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </CardDescription>
          </div>

          {/* Status: Deployment and Homepage Latency */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            {/* Status Badge */}
            <Badge variant="outline" className={`text-xs ${getStatusColor(transformed.status)}`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(transformed.status)}
                <span className={getStatusTextColor(transformed.status)}>
                  {transformed.status.charAt(0).toUpperCase() + transformed.status.slice(1)}
                </span>
              </span>
            </Badge>

            {/* Website Status */}
            <Badge variant="outline" className={`text-xs ${getStatusColor(transformed.status)}`}>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {isPinging ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : latency !== null ? (
                  latency
                ) : (
                  <span className="text-gray-400">...</span>
                )}
              </span>
            </Badge>
          </div>
        </div>

      </CardHeader>

      {/* Status, Framework, and Node Version */}
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Framework Badge */}
            <Badge variant="secondary" className="text-xs">
              <span className="flex items-center gap-1">
                {(() => {
                  const config = getFrameworkConfig(transformed.framework)
                  const IconComponent = config.icon
                  return <IconComponent />
                })()}
                {getFrameworkConfig(transformed.framework).formattedName}
              </span>
            </Badge>

            {/* Node Version Badge */}
            <Badge variant="outline" className="text-xs">
              <span className="flex items-center gap-1">
                <NodeJsIcon />
                Node {transformed.nodeVersion}
              </span>
            </Badge>

            {/* Serverless Function Region Badge */}
            <Badge variant="outline" className="text-xs">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {transformed.serverlessFunctionRegion}
              </span>
            </Badge>
          </div>
        </div>

        {/* Last Deployment */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Last Deployment</h4>

          <div className="text-xs text-gray-600 space-y-1">
            {/* State and Date */}
            <div className="flex items-center gap-2">
              {getStatusIcon(transformed.lastDeployment.state)}
              <span>{formatDate(transformed.lastDeployment.createdAt)}</span>
            </div>

            {/* Branch and Version */}
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              <span>{transformed.lastDeployment.branch}</span>
              <Badge variant="outline" className="text-xs">
                {transformed.lastDeployment.version}
              </Badge>
            </div>

            {/* Trigger */}
            <div className="flex items-center gap-2">
              {getTriggerTypeIcon(transformed.lastDeployment.triggeredBy.type)}
              <span className="truncate">by {transformed.lastDeployment.triggeredBy.name} via {transformed.lastDeployment.triggeredBy.type}</span>
            </div>

            {/* Commit Message */}
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{transformed.lastDeployment.commit}</span>
            </div>
          </div>
        </div>

        {/* Environments */}
        <Tabs defaultValue={availableTargets[0]} className="w-full">
          <TabsList
            className={
              availableTargets.length === 1
                ? 'flex w-full'
                : `grid w-full grid-cols-${availableTargets.length}`
            }
          >
            {availableTargets.map((target) => (
              <TabsTrigger
                key={target}
                value={target}
                className={`text-xs ${availableTargets.length === 1 ? 'w-full cursor-default' : ''}`}
              >
                {getTargetDisplayName(target)}
              </TabsTrigger>
            ))}
          </TabsList>
          {availableTargets.map((target) => {
            const envData = getEnvironmentData(target)
            return (
              <TabsContent key={target} value={target} className="space-y-2 mt-3">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Branch:</span>
                    <span className="font-mono">{envData.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Version:</span>
                    <span className="font-mono">{envData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge
                      variant={envData.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {envData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Deploy:</span>
                    <span>{formatDate(envData.lastDeployed)}</span>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Analytics Summary */}
        <div className="pt-2 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-gray-900">{transformed.analytics.visitors.toLocaleString()}</div>
              <div className="text-gray-500">Visitors</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{transformed.analytics.requests.toLocaleString()}</div>
              <div className="text-gray-500">Requests</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{transformed.analytics.bandwidth}</div>
              <div className="text-gray-500">Bandwidth</div>
            </div>
          </div>
        </div>

        {/* Cron Jobs Accordion */}
        {transformed.cronJobs.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cron-jobs" className="border-0">
              <AccordionTrigger className="text-xs py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Cron Jobs ({transformed.cronJobs.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                {transformed.cronJobs.map((cron) => (
                  <div key={cron.id} className="border rounded p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cron.name}</span>
                      <div className="flex items-center gap-1">
                        {cron.status === "active" ? (
                          <Play className="h-3 w-3 text-green-500" />
                        ) : (
                          <Pause className="h-3 w-3 text-gray-400" />
                        )}
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0" title="View Logs">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-500">{formatCronSchedule(cron.schedule)}</div>
                    <div className="flex justify-between text-gray-400">
                      <span>Next: {formatDate(cron.nextRun)}</span>
                      <span>Last: {formatDate(cron.lastRun)}</span>
                    </div>
                    <div className="text-gray-500 font-mono text-xs">{cron.endpoint}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Version Information Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="version-info" className="border-0">
            <AccordionTrigger className="text-xs py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3" />
                Version Information
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-xs space-y-3">
              {/* Build Configuration */}
              <div className="space-y-2">
                <h5 className="font-medium flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  Build Configuration
                </h5>
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Build Command:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{transformed.versionInfo.buildCommand}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Install Command:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">
                      {transformed.versionInfo.installCommand}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Directory:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded flex items-center gap-1">
                      <Folder className="h-3 w-3" />
                      {transformed.versionInfo.outputDirectory}
                    </code>
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              <div className="space-y-2">
                <h5 className="font-medium flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Dependencies
                </h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {Object.entries(transformed.versionInfo.dependencies).map(([name, version]) => (
                    <div key={name} className="flex justify-between text-gray-600">
                      <span className="truncate">{name}</span>
                      <code className="text-xs bg-gray-100 px-1 rounded ml-2">{version}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dev Dependencies */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700">Dev Dependencies</h5>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {Object.entries(transformed.versionInfo.devDependencies).map(([name, version]) => (
                    <div key={name} className="flex justify-between text-gray-500 text-xs">
                      <span className="truncate">{name}</span>
                      <code className="text-xs bg-gray-50 px-1 rounded ml-2">{version}</code>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
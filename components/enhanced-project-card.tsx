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
} from "lucide-react"
import { Project } from "@/lib/types"
import { getStatusIcon, getStatusColor, getTriggerTypeIcon, formatDate, formatCronSchedule } from "@/lib/project-utils"

interface EnhancedProjectCardProps {
  project: Project
}

export function EnhancedProjectCard({ project }: EnhancedProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {project.domain}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={project.settingsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Source Code
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status, Framework, and Node Version */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {project.framework}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Node {project.nodeVersion}
            </Badge>
          </div>
          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(project.status)}
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </Badge>
        </div>

        {/* Last Deployment */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Last Deployment</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <GitBranch className="h-3 w-3" />
              <span>{project.lastDeployment.branch}</span>
              <Badge variant="outline" className="text-xs">
                {project.lastDeployment.version}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(project.lastDeployment.state)}
              <span>{formatDate(project.lastDeployment.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              {getTriggerTypeIcon(project.lastDeployment.triggeredBy.type)}
              <span className="truncate">by {project.lastDeployment.triggeredBy.name}</span>
            </div>
            <div className="truncate text-gray-500">{project.lastDeployment.commit}</div>
          </div>
        </div>

        {/* Environments */}
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="production" className="text-xs">
              Prod
            </TabsTrigger>
            <TabsTrigger value="staging" className="text-xs">
              Stage
            </TabsTrigger>
            <TabsTrigger value="develop" className="text-xs">
              Dev
            </TabsTrigger>
          </TabsList>
          <TabsContent value="production" className="space-y-2 mt-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Branch:</span>
                <span className="font-mono">{project.environments.production.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-mono">{project.environments.production.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge
                  variant={project.environments.production.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {project.environments.production.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Deploy:</span>
                <span>{formatDate(project.environments.production.lastDeployed)}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="staging" className="space-y-2 mt-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Branch:</span>
                <span className="font-mono">{project.environments.staging.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-mono">{project.environments.staging.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge
                  variant={project.environments.staging.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {project.environments.staging.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Deploy:</span>
                <span>{formatDate(project.environments.staging.lastDeployed)}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="develop" className="space-y-2 mt-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Branch:</span>
                <span className="font-mono">{project.environments.develop.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-mono">{project.environments.develop.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge
                  variant={project.environments.develop.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {project.environments.develop.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Deploy:</span>
                <span>{formatDate(project.environments.develop.lastDeployed)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Analytics Summary */}
        <div className="pt-2 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-gray-900">{project.analytics.visitors.toLocaleString()}</div>
              <div className="text-gray-500">Visitors</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{project.analytics.requests.toLocaleString()}</div>
              <div className="text-gray-500">Requests</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{project.analytics.bandwidth}</div>
              <div className="text-gray-500">Bandwidth</div>
            </div>
          </div>
        </div>

        {/* Cron Jobs Accordion */}
        {project.cronJobs.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cron-jobs" className="border-0">
              <AccordionTrigger className="text-xs py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Cron Jobs ({project.cronJobs.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-2">
                {project.cronJobs.map((cron) => (
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
                    <code className="text-xs bg-gray-100 px-1 rounded">{project.versionInfo.buildCommand}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Install Command:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">
                      {project.versionInfo.installCommand}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Directory:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded flex items-center gap-1">
                      <Folder className="h-3 w-3" />
                      {project.versionInfo.outputDirectory}
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
                  {Object.entries(project.versionInfo.dependencies).map(([name, version]) => (
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
                  {Object.entries(project.versionInfo.devDependencies).map(([name, version]) => (
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
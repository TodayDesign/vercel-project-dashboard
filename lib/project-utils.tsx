import { AlertCircle, CheckCircle, Clock, Activity, GitBranch, User, Zap, Terminal } from "lucide-react"

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
      return <GitBranch className="h-4 w-4" />
    case "manual":
      return <User className="h-4 w-4" />
    case "webhook":
      return <Zap className="h-4 w-4" />
    case "api":
      return <Terminal className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
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
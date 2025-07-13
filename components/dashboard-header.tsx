import { Button } from "@/components/ui/button"
import { RefreshCw, Zap } from "lucide-react"

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export function DashboardHeader({ isRefreshing, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-gray-900">Vercel Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
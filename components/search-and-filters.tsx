import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Status: {statusFilter === "all" ? "All" : statusFilter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>All Statuses</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("ready")}>Ready</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("building")}>Building</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("error")}>Error</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
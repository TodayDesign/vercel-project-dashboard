# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 dashboard application for managing Vercel projects. It provides a comprehensive interface to view project deployments, environments, analytics, and configuration details.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with shadcn/ui component library
- **TypeScript**: Full TypeScript support
- **Package Manager**: pnpm (based on pnpm-lock.yaml)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Project Structure

```
app/
├── api/
│   ├── projects/route.ts          # GET /api/projects - fetch Vercel projects
│   └── deployments/[projectId]/   # GET /api/deployments/[id] - fetch deployments
├── globals.css                    # Global styles
├── layout.tsx                     # Root layout
├── loading.tsx                    # Loading UI
└── page.tsx                       # Main dashboard page

components/
├── dashboard-header.tsx           # Header with refresh functionality
├── enhanced-project-card.tsx      # Main project card component
├── project-grid.tsx               # Grid layout for projects
├── search-and-filters.tsx         # Search and status filtering
├── theme-provider.tsx             # Theme context provider
└── ui/                           # shadcn/ui components (extensive)

hooks/
├── use-mobile.tsx                 # Mobile detection hook
├── use-projects.ts                # Project data fetching hook
└── use-toast.ts                   # Toast notifications

lib/
├── example-vercel-project-data.json  # Sample API response data
├── mock-data.ts                   # Mock project data for development
├── project-utils.tsx              # Utility functions for projects
├── types.ts                       # TypeScript interface definitions
├── utils.ts                       # General utility functions (cn, etc.)
├── vercel-api.ts                  # Vercel API client class
└── vercel-transform.ts            # Transform Vercel API data

docs/
└── workflow/
    └── FEATURE_WORKFLOW.md        # Feature development process
```

## Key Architecture Notes

### API Integration
- The app is designed to integrate with Vercel's REST API
- API routes in `app/api/` handle server-side Vercel API calls
- `lib/vercel-api.ts` contains a `VercelAPI` class for API interactions
- Environment variable `VERCEL_API_TOKEN` is required for API authentication

### Data Flow
- Main dashboard (`app/page.tsx`) uses `useProjects` hook for data fetching
- API integration via `/api/projects` endpoint with fallback to mock data
- Data transformations handled in `lib/vercel-transform.ts`
- TypeScript interfaces defined in `lib/types.ts` (dual interface system: `VercelProject` from API, `Project` for UI)

### UI Components
- Built with shadcn/ui component library (Radix UI + Tailwind CSS)
- Modular component architecture:
  - `EnhancedProjectCard`: Feature-rich project cards with tabs for deployments, environments, cron jobs
  - `ProjectGrid`: Responsive grid layout for project display
  - `SearchAndFilters`: Search and status filtering functionality
  - `DashboardHeader`: Header with refresh controls
- Comprehensive project cards showing:
  - Deployment status and history with branching info
  - Multiple environments (production, staging, develop) 
  - CRON jobs with schedule formatting
  - Analytics and version information
  - Direct links to project, settings, and source code
- Responsive design with mobile-first approach and mobile detection hooks

### Component Architecture
- Uses custom hooks pattern (`use-projects.ts`, `use-mobile.tsx`, `use-toast.ts`)
- Utility functions in `lib/project-utils.tsx` for consistent formatting
- All UI components follow shadcn/ui patterns with extensive component library
- Icons from Lucide React

## Development Notes

- ESLint and TypeScript errors are ignored during builds (see next.config.mjs)
- Images are unoptimized for deployment flexibility
- Mock data structure mirrors expected Vercel API responses
- Feature development follows structured workflow in `docs/workflow/FEATURE_WORKFLOW.md`
- Supports both personal and team Vercel accounts via `VERCEL_TEAM_ID` environment variable

## Environment Variables

Required for production API integration:
- `VERCEL_API_TOKEN` - Vercel API authentication token
- `VERCEL_TEAM_ID` - (Optional) Team ID for team projects

Authentication configuration (required):
- `AUTH_USERNAME` - Basic auth username (authentication fails if not set)
- `AUTH_PASSWORD` - Basic auth password (authentication fails if not set)

## API Endpoints

All API endpoints require Basic HTTP authentication.

- `GET /api/projects` - Returns list of Vercel projects with fallback to error data when API unavailable
- `GET /api/deployments/[projectId]` - Returns deployments for specific project

API routes include comprehensive error handling and return mock error data when Vercel API is unavailable. Authentication is handled by `lib/auth.ts` utility functions.

## Data Architecture

The application uses a dual-interface system:
- `VercelProject` - Raw interface matching Vercel API response structure
- `Project` - Transformed interface optimized for UI components
- Transformation handled by `transformVercelProject()` in `lib/vercel-transform.ts`
- Mock data available in `lib/mock-data.ts` and `lib/example-vercel-project-data.json`

## Feature Development Workflow

This project follows a structured feature development process:
1. Feature specification generation in `feature-specs/` directory
2. Review and approval process
3. Implementation with TodoWrite tracking
4. Integration testing

See `docs/workflow/FEATURE_WORKFLOW.md` for complete workflow details.

## Authentication

The application implements Basic HTTP authentication using the browser's native credential dialog:

### Native Browser Authentication
- Uses browser's native Basic Auth dialog (username/password popup)
- API endpoints return 401 with `WWW-Authenticate: Basic` header
- Browser automatically handles credential caching and presentation
- React Context (`AuthProvider`) tracks authentication state
- Auth guard component shows fallback UI until authenticated

### API Authentication  
- All API endpoints protected with Basic HTTP authentication
- Reusable `requireAuth()` utility in `lib/auth.ts`
- Higher-order `withAuth()` function for wrapping route handlers
- Proper WWW-Authenticate headers trigger browser's native auth dialog

### Authentication Flow
1. User accesses protected resource
2. API returns 401 with `WWW-Authenticate: Basic realm="Vercel Dashboard"`
3. Browser shows native username/password dialog
4. Browser automatically includes credentials in subsequent requests
5. React app tracks authentication state via API response success

### Usage for New API Routes
```typescript
import { requireAuth, createUnauthorizedResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error)
  }
  // Your API logic here
}

// Or use the higher-order function:
import { withAuth } from "@/lib/auth"
export const GET = withAuth(async (request) => {
  // Your API logic here
})
```
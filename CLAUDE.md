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
├── project-card.tsx               # Reusable project card component
├── theme-provider.tsx             # Theme context provider
└── ui/                           # shadcn/ui components

lib/
├── utils.ts                      # Utility functions (cn, etc.)
└── vercel-api.ts                 # Vercel API client class
```

## Key Architecture Notes

### API Integration
- The app is designed to integrate with Vercel's REST API
- API routes in `app/api/` handle server-side Vercel API calls
- `lib/vercel-api.ts` contains a `VercelAPI` class for API interactions
- Environment variable `VERCEL_API_TOKEN` is required for API authentication

### Data Flow
- Main dashboard (`app/page.tsx`) currently uses mock data
- Real API integration is prepared but commented out in API routes
- Project and deployment data structures are defined in TypeScript interfaces

### UI Components
- Built with shadcn/ui component library (Radix UI + Tailwind CSS)
- Comprehensive project cards showing:
  - Deployment status and history
  - Multiple environments (production, staging, develop)
  - CRON jobs and analytics
  - Version information and dependencies
- Responsive design with mobile-first approach

### Component Structure
- `ProjectCard` component is available but main dashboard uses inline implementation
- All UI components follow shadcn/ui patterns
- Icons from Lucide React

## Development Notes

- ESLint and TypeScript errors are ignored during builds (see next.config.mjs)
- Images are unoptimized for deployment flexibility
- Mock data structure mirrors expected Vercel API responses
- Ready for real API integration by uncommenting API routes and adding VERCEL_API_TOKEN

## API Endpoints

- `GET /api/projects` - Returns list of Vercel projects
- `GET /api/deployments/[projectId]` - Returns deployments for specific project

Both endpoints are prepared for Vercel API integration but currently return mock data or fetch directly without proper error handling.
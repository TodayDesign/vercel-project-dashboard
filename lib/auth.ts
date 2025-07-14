import { NextRequest, NextResponse } from "next/server"

export interface AuthConfig {
  username: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: { username: string }
}

/**
 * Extract Basic Auth credentials from Authorization header
 */
function parseBasicAuth(authHeader: string): { username: string; password: string } | null {
  if (!authHeader.startsWith('Basic ')) {
    return null
  }

  try {
    const base64Credentials = authHeader.slice(6)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    
    if (!username || !password) {
      return null
    }

    return { username, password }
  } catch {
    return null
  }
}

/**
 * Validate authentication credentials
 */
export function validateAuth(username: string, password: string): AuthResult {
  const validUsername = process.env.AUTH_USERNAME
  const validPassword = process.env.AUTH_PASSWORD

  // Fail if environment variables are not set
  if (!validUsername || !validPassword) {
    return {
      success: false,
      error: 'Authentication not configured'
    }
  }

  if (username === validUsername && password === validPassword) {
    return {
      success: true,
      user: { username }
    }
  }

  return {
    success: false,
    error: 'Invalid credentials'
  }
}

/**
 * Middleware function to protect API routes with Basic Auth
 * Usage: const authResult = await requireAuth(request)
 * if (!authResult.success) return NextResponse.json({ error: authResult.error }, { status: 401 })
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return {
      success: false,
      error: 'Authorization header required'
    }
  }

  const credentials = parseBasicAuth(authHeader)

  if (!credentials) {
    return {
      success: false,
      error: 'Invalid authorization format'
    }
  }

  return validateAuth(credentials.username, credentials.password)
}

/**
 * Helper function to create unauthorized response with proper WWW-Authenticate header
 */
export function createUnauthorizedResponse(error: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Vercel Dashboard"'
      }
    }
  )
}

/**
 * Higher-order function to wrap API route handlers with authentication
 * Usage: export const GET = withAuth(async (request, context) => { ... })
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return createUnauthorizedResponse(authResult.error)
    }

    return handler(request, ...args)
  }
}
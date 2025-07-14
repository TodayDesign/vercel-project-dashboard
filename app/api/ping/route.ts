import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, createUnauthorizedResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check authentication
  const authResult = await requireAuth(request)
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error)
  }

  try {
    const { domain } = await request.json()
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    // Perform the latency test
    const start = performance.now()
    
    try {
      // Use a lightweight endpoint like favicon.ico for consistent testing
      const response = await fetch(`https://${domain}/favicon.ico?_=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        // Add a reasonable timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      const end = performance.now()
      const latency = Math.round(end - start)
      
      return NextResponse.json({ 
        latency,
        status: response.status,
        success: true 
      })
      
    } catch (fetchError) {
      // If the specific endpoint fails, try the root domain
      try {
        const startRetry = performance.now()
        const response = await fetch(`https://${domain}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: AbortSignal.timeout(10000)
        })
        
        const endRetry = performance.now()
        const latency = Math.round(endRetry - startRetry)
        
        return NextResponse.json({ 
          latency,
          status: response.status,
          success: true 
        })
        
      } catch (retryError) {
        return NextResponse.json({ 
          error: 'Failed to reach domain',
          success: false 
        }, { status: 503 })
      }
    }
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request',
      success: false 
    }, { status: 400 })
  }
} 
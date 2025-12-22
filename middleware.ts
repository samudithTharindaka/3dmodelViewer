import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Allow API routes to handle their own auth
        if (path.startsWith('/api/')) {
          return true
        }
        
        // Protect these pages
        const protectedPaths = ['/upload', '/profile']
        if (protectedPaths.some(p => path.startsWith(p))) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/upload/:path*', '/profile/:path*'],
}



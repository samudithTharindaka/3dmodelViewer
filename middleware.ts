import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const protectedPaths = ['/upload']
      const path = req.nextUrl.pathname
      
      if (protectedPaths.some(p => path.startsWith(p))) {
        return !!token
      }
      
      return true
    },
  },
})

export const config = {
  matcher: ['/upload/:path*'],
}



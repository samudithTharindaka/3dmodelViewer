import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Auth: authorize called')
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Auth: Missing credentials')
          throw new Error('Please enter email and password')
        }

        await connectToDatabase()
        console.log('Auth: Database connected')

        const user = await User.findOne({ email: credentials.email.toLowerCase() })

        if (!user) {
          console.log('Auth: User not found')
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          console.log('Auth: Invalid password')
          throw new Error('Invalid password')
        }

        console.log('Auth: User authenticated:', user.email)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        console.log('JWT callback: token created for user', user.email)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        console.log('Session callback: session created', session.user.email)
      }
      return session
    },
  },
}



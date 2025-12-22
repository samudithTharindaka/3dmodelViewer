import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from '@/components/SessionProvider'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'ModelViewer - 3D Model Gallery',
  description: 'Upload and view 3D models in your browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="pt-24 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-black"
            >
              <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
            </svg>
          </div>
          <span className="text-xl font-bold group-hover:text-accent transition-colors">
            ModelViewer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Gallery
          </Link>
          {status === 'authenticated' && (
            <>
              <Link
                href="/upload"
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                Upload
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {status === 'loading' ? (
            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ) : status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="btn-secondary text-sm py-2 px-4"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                Login
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            {status === 'authenticated' && (
              <>
                <Link
                  href="/upload"
                  className="text-sm font-medium hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Upload
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              {status === 'authenticated' ? (
                <button
                  onClick={() => signOut()}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-4">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}



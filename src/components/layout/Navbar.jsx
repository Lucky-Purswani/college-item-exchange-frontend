import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/listings', label: 'All Listings' },
  { to: '/my-listings', label: 'My Listings' },
  { to: '/chat', label: 'Messages' },
  { to: '/profile', label: 'Profile' },
]

export function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const clearUser = useAuthStore((s) => s.clearUser)
  const queryClient = useQueryClient()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch {
      // ignore
    } finally {
      setIsExiting(true)
      document.body.classList.add('animate-fade-out')
      
      // Allow fade-out animation to play
      setTimeout(() => {
        clearUser()
        queryClient.clear()
        localStorage.removeItem('isLoggedIn')
        window.location.href = '/login'
      }, 300)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 shadow-sm transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-stone-900 font-bold text-lg tracking-tight">
            Needly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            NAV_LINKS.map(({ to, label }) => {
              const isActive = currentPath === to || currentPath.startsWith(to + '/')
              return (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm" className="ml-1 bg-stone-900 hover:bg-stone-800 text-white border-0 shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={[
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all ml-2 border border-stone-200',
                currentPath.startsWith('/admin')
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50 bg-white shadow-sm',
              ].join(' ')}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Desktop logout */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center">
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          id="navbar-mobile-toggle"
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-stone-200 bg-white/95 backdrop-blur-xl px-4 pb-4 md:hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 pt-3">
            {isAuthenticated ? (
              <>
                {NAV_LINKS.map(({ to, label }) => {
                  const isActive = currentPath === to
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={[
                        'px-3 py-2 rounded-md text-sm font-medium transition-all',
                        isActive
                          ? 'bg-stone-100 text-stone-900'
                          : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  )
                })}
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className={[
                      'px-3 py-2 rounded-md text-sm font-medium transition-all mt-1 border border-stone-200',
                      currentPath.startsWith('/admin')
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50 bg-white shadow-sm',
                    ].join(' ')}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-left text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 transition-all text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

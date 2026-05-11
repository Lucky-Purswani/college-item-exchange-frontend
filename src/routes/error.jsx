import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { useUIStore } from '@/store/ui.store'

export const Route = createFileRoute('/error')({
  component: ErrorPage,
})

/**
 * Global error page for 404 and unexpected errors.
 * Also used as notFoundComponent and errorComponent in the router.
 */
export function ErrorPage({ error }) {
  const is404 = !error

  useEffect(() => {
    useUIStore.getState().setHideNavbar(true)
    return () => useUIStore.getState().setHideNavbar(false)
  }, [])

  return (
    <PageShell fill className="flex items-center justify-center text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-8xl font-black text-stone-200 select-none">
          {is404 ? '404' : '⚠️'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            {is404 ? 'Page not found' : 'Something went wrong'}
          </h1>
          <p className="text-stone-500 text-sm">
            {is404
              ? "The page you're looking for doesn't exist or has been moved."
              : error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
        <Link to="/">
          <button
            id="error-go-home-btn"
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-stone-800 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md hover:-translate-y-0.5"
          >
            ← Go Home
          </button>
        </Link>
      </div>
    </PageShell>
  )
}

// Default export for file-based routing
export default ErrorPage

import { useEffect } from 'react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/Navbar'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUIStore } from '@/store/ui.store'
import { Toaster } from 'sonner'
import { ErrorPage } from '@/routes/error'
import { cn } from '@/lib/utils'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: ErrorPage,
})

function RootLayout() {
  const { data: user, isFetched } = useCurrentUser()
  const hideNavbar = useUIStore((s) => s.hideNavbar)
  const { location } = useRouterState()


  // Only show the full-screen loader until the absolute first auth check finishes
  if (!isFetched) {
    return (
      <div className="min-h-[100svh] bg-stone-50 flex flex-col items-center justify-center text-stone-900">
        <div className="h-6 w-6 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
      </div>
    )
  }

  const isPublicRoute = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname)
  const showPublicBg = !user && isPublicRoute

  return (
    <>
      <div className={cn(
        "min-h-[100svh] flex flex-col relative transition-colors duration-500 animate-fade-in",
        showPublicBg 
          ? "bg-[#fdfbf7] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" 
          : "bg-stone-50"
      )}>
        <div className="relative z-10 flex-1 flex flex-col">
          {!hideNavbar && <Navbar />}
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
      
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

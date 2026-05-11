import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { PageShell } from '@/components/layout/PageShell'


export const Route = createFileRoute('/_protected/home')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()

  const name = user?.displayName || user?.email?.split('@')[0] || 'there'

  return (
    <PageShell fill className="flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Welcome, {name}
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight mb-6">
          Your campus marketplace, <br className="hidden sm:block" />
          <span className="text-stone-400">simplified.</span>
        </h1>
        
        <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto">
          Discover textbooks, furniture, and electronics from your peers, or turn your unused items into cash.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/listings"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-stone-900 text-white font-medium shadow-md hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Browse Listings
          </Link>
          <Link
            to="/my-listings"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-stone-900 border border-stone-200 font-medium shadow-sm hover:bg-stone-50 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Your Listings
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

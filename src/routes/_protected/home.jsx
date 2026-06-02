import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { PageShell } from '@/components/layout/PageShell'
import { ShoppingBag, ArrowRight, BookOpen, Laptop, Bike, Sofa } from 'lucide-react'

export const Route = createFileRoute('/_protected/home')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()
  const name = user?.displayName || user?.email?.split('@')[0] || 'there'

  return (
    <PageShell fill className="relative flex flex-col items-center justify-center overflow-hidden">
      {/* ── BACKGROUND PIXEL ANIMATION ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-stone-300 rounded-sm animate-pulse"
            style={{
              width: `${Math.floor(Math.random() * 8 + 4)}px`,
              height: `${Math.floor(Math.random() * 8 + 4)}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-slow ${Math.random() * 10 + 15}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-12">
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-stone-600 shadow-sm animate-fade-in">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          Welcome back, {name}
        </div>

        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1]">
            Marketplace <span className="text-stone-400 italic">Redefined</span> <br />
            for Campus Life.
          </h1>
          <p className="text-base sm:text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            Trade with trusted peers. Simple, fast, and secure listing 
            for everything you need on campus.
          </p>
        </div>

        

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/listings"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-stone-900 text-white font-bold shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <ShoppingBag className="h-5 w-5" />
            Explore Store
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/listing/new"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-stone-900 border border-stone-200 font-bold shadow-sm hover:bg-stone-50 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Post Item
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

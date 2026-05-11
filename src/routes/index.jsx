import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { PageShell } from '@/components/layout/PageShell'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { data: currentUser, isPending } = useCurrentUser()

  if (isPending) {
    return (
      <PageShell fill className="flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
      </PageShell>
    )
  }

  if (currentUser) {
    return <Navigate to="/home" replace />
  }

  return (
    <PageShell fill className="flex flex-col items-center justify-center text-center bg-transparent">
      <div className="relative z-10 max-w-3xl mx-auto space-y-8 bg-stone-50/50 p-4 rounded-2xl backdrop-blur-sm">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Exclusive to College Students
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900">
          Welcome to{' '}
          <span className="text-stone-500">
            Needly
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
          The trusted marketplace to buy, sell, and trade items within your college campus. From textbooks to dorm room desks, connect directly with your peers.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/login">
            <Button
              id="landing-login-btn"
              size="lg"
              className="bg-stone-900 hover:bg-stone-800 text-white border-0 px-8 h-11 text-base font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Login to Campus
            </Button>
          </Link>
          <Link to="/register">
            <Button
              id="landing-signup-btn"
              size="lg"
              variant="outline"
              className="border-stone-200 text-stone-700 bg-white hover:bg-stone-50 px-8 h-11 text-base font-semibold transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Register Now
            </Button>
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12">
          {[
            { icon: '🏫', title: 'College Email Only', desc: 'A secure and verified community exclusively for students.' },
            { icon: '✉️', title: 'Direct Contact', desc: 'Inquiries go straight to the seller\'s college inbox.' },
            { icon: '🛡️', title: 'Trusted Environment', desc: 'Look for Verified Student badges and report suspicious listings.' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-stone-200 bg-white p-5 text-left hover:border-stone-300 hover:shadow-md transition-all shadow-sm"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <div className="font-semibold text-stone-900 text-sm mb-1">{title}</div>
              <div className="text-xs text-stone-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

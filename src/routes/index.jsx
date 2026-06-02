import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { PageShell } from '@/components/layout/PageShell'
import { GraduationCap, Mail, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { data: currentUser, isPending } = useCurrentUser()
  const [flippedIndex, setFlippedIndex] = useState(null)

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
      <div className="relative z-10 max-w-3xl bg-transparent mx-auto space-y-6 sm:space-y-8 p-4 rounded-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-stone-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Exclusive to College Students
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900">
          Welcome to{' '}
          <span className="text-stone-500">
            Needly
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
          The trusted marketplace to trade within your college campus. 
          Connect directly with your peers.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              id="landing-login-btn"
              size="lg"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white border-0 px-8 h-10 sm:h-11 text-sm sm:text-base font-semibold shadow-md transition-all hover:shadow-lg"
            >
              Login to Needly
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              id="landing-signup-btn"
              size="lg"
              variant="outline"
              className="w-full border-stone-200 text-stone-700 bg-white hover:bg-stone-50 px-8 h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all shadow-sm"
            >
              Register Now
            </Button>
          </Link>
        </div>

        {/* Feature grid - 3 in a row on mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-8">
          {[
            { icon: <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-stone-700" />, title: 'College Email', desc: 'Secure community for students.' },
            { icon: <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-stone-700" />, title: 'Direct Contact', desc: 'Straight to college inbox.' },
            { icon: <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-stone-700" />, title: 'Trusted Env', desc: 'Verified Student badges.' },
          ].map(({ icon, title, desc }, index) => (
            <div 
              key={title} 
              className="group h-28 sm:h-36 [perspective:1000px] cursor-pointer"
              onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
            >
                <div 
                  className={`relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-md
                    ${flippedIndex === index ? 'max-sm:[transform:rotateY(180deg)]' : ''}
                    sm:group-hover:[transform:rotateY(180deg)]
                  `}
                >
                {/* Front Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-white border border-stone-200 p-2 sm:p-5 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
                  <div className="mb-1 sm:mb-2 flex items-center justify-center">{icon}</div>
                  <div className="font-bold text-stone-900 text-[9px] sm:text-sm leading-tight uppercase tracking-tighter sm:tracking-normal">{title}</div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-stone-900 text-white p-2 sm:p-4 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="font-bold text-white text-[9px] sm:text-sm mb-0.5 sm:mb-1 leading-tight">{title}</div>
                  <p className="text-[8px] sm:text-xs leading-tight text-stone-300">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

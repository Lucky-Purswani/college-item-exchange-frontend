import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { verifyEmail } from '@/api/auth.api'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search) => ({
    token: search.token || '',
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { token } = Route.useSearch()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error' | 'no-token'
  const [message, setMessage] = useState('')
  const hasVerified = useRef(false) // Guard against React Strict Mode double-invocation

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }

    // Prevent double-call in React Strict Mode (dev only double-fires effects)
    if (hasVerified.current) return
    hasVerified.current = true

    verifyEmail(token)
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ?? 'This link is invalid or has expired.'
        setMessage(msg)
        setStatus('error')
      })
  }, [token])

  return (
    <PageShell fill className="flex items-center justify-center bg-transparent animate-fade-in">
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-10 shadow-xl shadow-stone-200/50">

          {/* Loading */}
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-stone-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-stone-900">Verifying your email…</h1>
              <p className="text-sm text-stone-500 mt-2">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-stone-900 mb-2">Email Verified!</h1>
              <p className="text-sm text-stone-500 mb-6">
                Your account has been verified. You can now log in.
              </p>
              <Link to="/login">
                <Button className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all">
                  Go to Login
                </Button>
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-stone-900 mb-2">Verification Failed</h1>
              <p className="text-sm text-stone-500 mb-6">
                {message || 'This link is invalid or has already expired.'}
              </p>
              <Link to="/register">
                <Button className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all">
                  Register Again
                </Button>
              </Link>
            </>
          )}

          {/* No token */}
          {status === 'no-token' && (
            <>
              <XCircle className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-stone-900 mb-2">Invalid Link</h1>
              <p className="text-sm text-stone-500 mb-6">
                This verification link is missing a token. Please use the link from your email.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full h-10 border-stone-200 text-stone-700 font-semibold">
                  Back to Login
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </PageShell>
  )
}

import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { forgotPassword } from '@/api/auth.api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/layout/PageShell'
import logo1 from '@/assets/logo1.jpg'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const { data: currentUser, isPending } = useCurrentUser()
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email)
      setSuccess(true)
    } catch (err) {
      const message =
        err?.response?.data?.message ?? 'Failed to send reset email. Please try again.'
      setError('root', { message })
    }
  }

  if (currentUser) {
    return <Navigate to="/home" replace />
  }


  return (
    <PageShell fill className="flex items-center justify-center bg-transparent animate-fade-in">
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 overflow-hidden items-center justify-center mix-blend-multiply mb-4">
            <img 
              src={logo1} 
              alt="Needly Logo" 
              className="w-full h-full object-cover scale-[1.4]"
            />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Reset Password</h1>
          <p className="text-stone-500 mt-1 text-sm">We&apos;ll send you a reset link</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-stone-200/50">
          {success ? (
            <div className="text-center space-y-4">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium">
                If an account exists for that email, a password reset link has been sent.
              </div>
              <p className="text-sm text-stone-600">
                Please check your college email inbox and spam folder.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Root error */}
              {errors.root && (
                <div className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
                  {errors.root.message}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-stone-700">
                  College Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@university.edu"
                  autoComplete="email"
                  className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                id="forgot-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all"
              >
                {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          {!success && (
            <p className="text-center text-sm text-stone-500 mt-6">
              Remembered your password?{' '}
              <Link to="/login" className="text-stone-900 hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </PageShell>
  )
}

import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { resetPassword } from '@/api/auth.api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/layout/PageShell'
import logo1 from '@/assets/logo1.jpg'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search) => {
    return {
      token: search.token || '',
    }
  },
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()
  const { data: currentUser, isPending } = useCurrentUser()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      await resetPassword({ token, password: data.password })
      // Redirect to login with success message
      navigate({ to: '/login', search: { reset: true } })
    } catch (err) {
      const message =
        err?.response?.data?.message ?? 'Failed to reset password. The link might be expired.'
      setError('root', { message })
    }
  }

  if (currentUser) {
    return <Navigate to="/home" replace />
  }


  // If there's no token in the URL, don't even show the form
  if (!token) {
    return (
      <PageShell fill className="flex items-center justify-center bg-transparent">
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-stone-200/50">
            <h1 className="text-xl font-bold text-stone-900 mb-2">Invalid Link</h1>
            <p className="text-stone-600 mb-6">
              This password reset link is invalid or missing the token. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </PageShell>
    )
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
          <h1 className="text-2xl font-bold text-stone-900">Choose a new password</h1>
          <p className="text-stone-500 mt-1 text-sm">Make sure it's at least 8 characters</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-stone-200/50">
          <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Root error */}
            {errors.root && (
              <div className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
                {errors.root.message}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reset-password" className="text-stone-700">
                New Password
              </Label>
              <Input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="reset-confirm-password" className="text-stone-700">
                Confirm New Password
              </Label>
              <Input
                id="reset-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="reset-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all"
            >
              {isSubmitting ? 'Resetting…' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  )
}

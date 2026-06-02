import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { register as registerUser } from '@/api/auth.api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/layout/PageShell'

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { data: currentUser, isPending } = useCurrentUser()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    try {
      await registerUser({ email: data.email, password: data.password })
      // This backend sends a verification email, does not set cookies
      navigate({ to: '/login', search: { registered: true } })
    } catch (err) {
      const message =
        err?.response?.data?.message ?? 'Registration failed. Please try again.'
      setError('root', { message })
    }
  }

  if (currentUser) {
    return <Navigate to="/home" replace />
  }


  return (
    <PageShell fill className="flex items-center justify-center bg-transparent animate-fade-in">

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 shadow-md mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Create an account</h1>
          <p className="text-stone-500 mt-1 text-sm">Join using your college email</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-stone-200/50">
          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Root error */}
            {errors.root && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.root.message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="register-email" className="text-stone-700">
                College Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="YYBBnnn@college.edu"
                autoComplete="email"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="register-password" className="text-stone-700">
                Password
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password" className="text-stone-700">
                Confirm Password
              </Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-stone-900 hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">
          A verification email will be sent to your college address.
          <br />
          You must verify before logging in.
        </p>
      </div>
    </PageShell>
  )
}

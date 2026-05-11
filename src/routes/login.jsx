import { useState } from 'react'
import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { getMe } from '@/api/auth.api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/layout/PageShell'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    reset: (search.reset === true || search.reset === 'true') ? true : undefined,
    registered: (search.registered === true || search.registered === 'true') ? true : undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const [isExiting, setIsExiting] = useState(false)
  const { reset, registered } = Route.useSearch()
  const { data: currentUser, isPending } = useCurrentUser()
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      // Attempt login — backend sets cookies
      const user = await login(data)
      
      // Set a browser flag so the frontend knows it's safe to request the user profile on refresh
      localStorage.setItem('isLoggedIn', 'true')

      if (user) {
        setUser(user)
        queryClient.setQueryData(['me'], user)
      }

      setIsExiting(true)
      document.body.classList.add('animate-fade-out')
      
      setTimeout(() => {
        navigate({ to: '/home' })
      }, 300)
    } catch (err) {
      const message =
        err?.response?.data?.message ?? 'Invalid email or password'
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
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 shadow-md mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Welcome back</h1>
          <p className="text-stone-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-md p-8 shadow-xl shadow-stone-200/50">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Success banners */}
            {reset && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium mb-4">
                Password reset successfully! Please sign in with your new password.
              </div>
            )}
            {registered && !reset && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium mb-4">
                Registration successful! Please check your email to verify before signing in.
              </div>
            )}

            {/* Root error */}
            {errors.root && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.root.message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-stone-700">
                Email address
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@university.edu"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-stone-700">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus-visible:border-stone-400 focus-visible:ring-stone-400/20 h-10"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white border-0 font-semibold shadow-md transition-all"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-stone-900 hover:underline font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  )
}

import { useState, useEffect } from 'react'
import { createFileRoute, Link as RouterLink, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/hooks/useAuth'
import { useUpdateProfile, useChangePassword } from '@/hooks/useProfile'
import { logout } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/_protected/profile/edit')({
  component: EditProfilePage,
})

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
})

function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()
  const { mutateAsync: changePassword, isPending: isUpdatingPassword } = useChangePassword()
  
  const clearUser = useAuthStore((s) => s.clearUser)
  const queryClient = useQueryClient()
  
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  })

  useEffect(() => {
    if (user?.displayName) {
      profileForm.reset({ displayName: user.displayName })
    }
  }, [user?.displayName, profileForm])

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = (data) => {
    setProfileMsg({ type: '', text: '' })
    updateProfile(data, {
      onSuccess: () => {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000)
      },
      onError: (err) => {
        setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
      }
    })
  }

  const onPasswordSubmit = async (data) => {
    setPasswordMsg({ type: '', text: '' })
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setPasswordMsg({ type: 'success', text: 'Password changed successfully! Logging out...' })
      
      // Logout and redirect
      setTimeout(async () => {
        try { await logout() } catch(e) {}
        clearUser()
        queryClient.clear()
        localStorage.removeItem('isLoggedIn')
        window.location.href = '/login'
      }, 2000)
      
    } catch (error) {
      setPasswordMsg({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
    }
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 space-y-4">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <div className="rounded-md border border-stone-200 p-1.5 hover:bg-stone-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Profile
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
            Account Settings
          </h1>
          <p className="text-sm text-stone-500">
            Manage your public identity and security preferences.
          </p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'profile' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          Identity
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'security' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          Security
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {/* Identity Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className="p-6 md:p-8 space-y-6">
              {profileMsg.text && (
                <div className={`p-3 rounded-md text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {profileMsg.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Display Name
                </label>
                <input
                  {...profileForm.register("displayName")}
                  placeholder="e.g. John Doe"
                  className={`w-full h-11 px-3 rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                    profileForm.formState.errors.displayName ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
                {profileForm.formState.errors.displayName && (
                  <p className="text-xs font-medium text-red-500">
                    {profileForm.formState.errors.displayName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">College Email</label>
                  <div className="h-11 rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 flex items-center text-sm text-stone-500 select-none">
                    {user?.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Academic Status</label>
                  <div className="h-11 rounded-md border border-dashed border-stone-300 bg-stone-50 px-3 flex items-center text-sm text-stone-500 select-none">
                    {user?.department} {user?.year ? (user.year < 100 ? 2000 + user.year : user.year) : ""}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">Secured Information</p>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    Email and department are verified during onboarding and cannot be changed.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <button 
                type="submit" 
                disabled={isUpdatingProfile}
                className="w-full sm:w-auto px-6 h-11 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <div className="p-6 md:p-8 space-y-6">
              {passwordMsg.text && (
                <div className={`p-3 rounded-md text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <div className="space-y-2 max-w-md">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Current Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  placeholder="••••••••"
                  className={`w-full h-11 px-3 rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                    passwordForm.formState.errors.currentPassword ? 'border-red-500' : 'border-stone-200'
                  }`}
                  disabled={isUpdatingPassword}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs font-medium text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("newPassword")}
                    placeholder="••••••••"
                    className={`w-full h-11 px-3 rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                      passwordForm.formState.errors.newPassword ? 'border-red-500' : 'border-stone-200'
                    }`}
                    disabled={isUpdatingPassword}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs font-medium text-red-500">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    placeholder="••••••••"
                    className={`w-full h-11 px-3 rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                      passwordForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-stone-200'
                    }`}
                    disabled={isUpdatingPassword}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs font-medium text-red-500">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-stone-100 pt-6 mt-2">
              <button 
                type="submit" 
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto px-6 h-11 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  )
}

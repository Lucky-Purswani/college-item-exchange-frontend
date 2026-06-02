import { createFileRoute as createRoute, Link as RouterLink } from '@tanstack/react-router'
import { User, Mail, School, Calendar, Settings, BadgeCheck, ShoppingBag, ArrowRight, Lock } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { PageLoader } from '@/components/loading'

export const Route = createRoute('/_protected/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const { isPending } = useCurrentUser()

  // Format academic year properly (e.g. 2023-27)
  const formatYear = (year) => {
    if (!year) return "N/A"
    const start = year < 100 ? 2000 + year : year
    const end = (start + 4).toString().slice(-2)
    return `${start}-${end}`
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
          Profile
        </h1>
        <p className="text-sm text-stone-500">
          Your account details and quick actions.
        </p>
      </div>

      {/* Profile Content */}
      {isPending && !user ? (
        <PageLoader />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 md:p-8 space-y-8">
          {/* Identity Section */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="relative shrink-0 self-start">
              <div className="h-16 w-16 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200">
                <User className="h-7 w-7 text-stone-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-stone-900 text-white p-1 rounded-md border-2 border-white shadow-sm">
                <BadgeCheck className="h-3 w-3" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 truncate">
                {user?.displayName || "Student"}
              </h2>
              <p className="text-sm text-stone-500 flex items-center gap-1.5">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <RouterLink 
                to="/profile/edit"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium transition-colors bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 shadow-sm gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </RouterLink>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <School className="h-3.5 w-3.5" />
                Department
              </p>
              <p className="text-sm font-medium text-stone-900">{user?.department || "N/A"}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Academic Year
              </p>
              <p className="text-sm font-medium text-stone-900">
                {formatYear(user?.year)}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                Active Listings
              </p>
              <p className="text-sm font-medium text-stone-900">{user?.activeListings || 0}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Account Status
              </p>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
                  user?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status === 'ACTIVE' && (
                    <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {user?.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile edit button */}
          <div className="sm:hidden">
            <RouterLink 
              to="/profile/edit"
              className="w-full inline-flex items-center justify-center h-10 rounded-md text-sm font-medium transition-colors bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 shadow-sm gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </RouterLink>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100" />

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RouterLink 
              to="/my-listings" 
              className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-100/50 hover:border-stone-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-stone-200">
                  <ShoppingBag className="h-5 w-5 text-stone-600" />
                </div>
                <span className="font-medium text-stone-900">My Listings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
            </RouterLink>
            
            <RouterLink 
              to="/profile/edit" 
              className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-100/50 hover:border-stone-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-stone-200">
                  <Lock className="h-5 w-5 text-stone-600" />
                </div>
                <span className="font-medium text-stone-900">Change Password</span>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
            </RouterLink>
          </div>
        </div>
      )}

    </PageShell>
  )
}

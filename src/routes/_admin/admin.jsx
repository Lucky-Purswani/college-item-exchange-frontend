import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, Users, AlertTriangle, UserCheck, UserX, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useAdminStats, useAdminUsers, useAdminReports, useBanUser, useUnbanUser, useUpdateReportStatus, useAdminDeleteListing } from '@/hooks/useAdmin'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { PageLoader } from '@/components/loading'

export const Route = createFileRoute('/_admin/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const { data: stats, isPending } = useAdminStats()

  return (
    <PageShell >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-stone-900" />
          Admin Dashboard
        </h1>
        <p className="text-stone-500 mt-2">Manage users, review reports, and monitor platform health.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isPending ? (
          // Refined Stats Skeleton
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
              <div className="h-3 w-20 bg-stone-100 rounded mb-4 animate-pulse" />
              <div className="h-7 w-12 bg-stone-100/80 rounded animate-pulse" />
            </div>
          ))
        ) : (
          [
            { label: 'Total Users', value: stats?.data?.users || 0 },
            { label: 'Active Listings', value: stats?.data?.listings?.active || 0 },
            { label: 'Total Reports', value: stats?.data?.reports?.total || 0 },
            { label: 'Open Reports', value: stats?.data?.reports?.open || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm animate-fade-in">
              <div className="text-sm font-medium text-stone-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
            </div>
          ))
        )}
      </div>



      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors border-b-2",
            activeTab === 'users' ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors border-b-2",
            activeTab === 'reports' ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700"
          )}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reports
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'users' ? <UsersTable /> : <ReportsTable />}
      </div>
    </PageShell>
  )
}

function UsersTable() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useAdminUsers()
  const { mutate: banUser, isPending: isBanning } = useBanUser()
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser()
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, action: null })
  const [bottomRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  const users = data?.pages.flatMap((page) => page.data) || []

  if (isPending) return <PageLoader />

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
          <tr>
            <th className="px-6 py-4 font-semibold">User</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-stone-900">{user.displayName || 'Unknown'}</div>
                <div className="text-stone-500">{user.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  user.role === 'ADMIN' ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
                )}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold",
                  user.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                )}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {user.role !== 'ADMIN' && (
                  user.status === 'ACTIVE' ? (
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, user, action: 'ban' })}
                      disabled={isBanning}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <UserX className="h-4 w-4" />
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, user, action: 'unban' })}
                      disabled={isUnbanning}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <UserCheck className="h-4 w-4" />
                      Unban
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-stone-500">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          const { user, action } = confirmModal
          if (action === 'ban') {
            banUser(user.id, {
              onSuccess: () => {
                toast.success(`User ${user.email} banned`)
                setConfirmModal({ isOpen: false, user: null, action: null })
              },
              onError: (err) => toast.error(err.response?.data?.message || "Failed to ban user")
            })
          } else {
            unbanUser(user.id, {
              onSuccess: () => {
                toast.success(`User ${user.email} unbanned`)
                setConfirmModal({ isOpen: false, user: null, action: null })
              },
              onError: (err) => toast.error(err.response?.data?.message || "Failed to unban user")
            })
          }
        }}
        isLoading={isBanning || isUnbanning}
        title={confirmModal.action === 'ban' ? "Ban User?" : "Unban User?"}
        description={
          confirmModal.action === 'ban'
            ? `Are you sure you want to ban ${confirmModal.user?.email}? All their active listings will be removed from the marketplace.`
            : `Are you sure you want to unban ${confirmModal.user?.email}? They will be able to post listings again.`
        }
        confirmText={confirmModal.action === 'ban' ? "Ban User" : "Unban User"}
        variant={confirmModal.action === 'ban' ? "destructive" : "primary"}
      />
      <div ref={bottomRef} className="h-10 flex items-center justify-center border-t border-stone-100">
        {isFetchingNextPage && <div className="h-5 w-5 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />}
      </div>
    </div>
  )
}

function ReportsTable() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useAdminReports()
  const { mutateAsync: updateReport, isPending: isUpdating } = useUpdateReportStatus()
  const { mutateAsync: banUser, isPending: isBanning } = useBanUser()
  const { mutateAsync: deleteListing, isPending: isDeleting } = useAdminDeleteListing()
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, report: null, action: null })
  const [bottomRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  const reports = data?.pages.flatMap((page) => page.data) || []

  if (isPending) return <PageLoader />

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Report Details</th>
            <th className="px-6 py-4 font-semibold">Listing</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-stone-50/50 transition-colors">
              <td className="px-6 py-4 max-w-[300px]">
                <div className="group relative">
                  <div className="font-medium text-stone-900 truncate cursor-help">
                    {report.reason}
                  </div>
                  
                  {/* Neat Tooltip */}
                  <div className="absolute top-full left-0 mt-3 hidden group-hover:block z-[60] pointer-events-none">
                    <div className="bg-stone-950 text-white text-[13px] rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-max max-w-[450px] whitespace-pre-wrap break-words leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200 border border-white/10">
                      <div className="absolute bottom-full left-6 -mb-1 border-[6px] border-transparent border-b-stone-950" />
                      {report.reason}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {report.listing ? (
                  <a href={`/listing/${report.listing.id}`} target="_blank" rel="noreferrer" className="text-stone-900 font-medium hover:underline flex items-center gap-1">
                    {report.listing.title}
                    <span className="text-stone-400">↗</span>
                  </a>
                ) : (
                  <span className="text-stone-400 line-through">Deleted Listing</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold",
                  report.status === 'OPEN' ? "bg-amber-50 text-amber-700" :
                  report.status === 'RESOLVED' ? "bg-emerald-50 text-emerald-700" :
                  "bg-stone-100 text-stone-600"
                )}>
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {report.status === 'OPEN' ? (
                  <ReportActions 
                    onAction={(action) => setConfirmModal({ isOpen: true, report, action })}
                    hasListing={!!report.listing}
                    hasUser={!!report.listing?.user}
                  />
                ) : (
                  <div className="flex items-center justify-end pr-4">
                    {report.status === 'RESOLVED' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-stone-500">No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={async () => {
          const { report, action } = confirmModal
          try {
            let res;
            if (action === 'resolve') {
              res = await updateReport({ id: report.id, status: 'RESOLVED' })
            } else if (action === 'remove') {
              res = await deleteListing(report.listing.id)
            } else if (action === 'ban') {
              res = await banUser(report.listing.user.id)
            } else if (action === 'reject') {
              res = await updateReport({ id: report.id, status: 'REJECTED' })
            }
            
            toast.success(res?.message || "Action processed successfully")
            setConfirmModal({ isOpen: false, report: null, action: null })
          } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process request")
          }
        }}
        isLoading={isUpdating || isBanning || isDeleting}
        title={
          confirmModal.action === 'resolve' ? "Resolve Report?" :
          confirmModal.action === 'remove' ? "Remove Listing?" :
          confirmModal.action === 'ban' ? "Ban User?" :
          "Reject Report?"
        }
        description={
          confirmModal.action === 'resolve' ? "Mark this report as resolved without taking any additional action." :
          confirmModal.action === 'remove' ? "This will permanently remove the listing and mark all associated reports as resolved." :
          confirmModal.action === 'ban' ? "This will ban the user, remove all their active listings, and resolve this report." :
          "Mark this report as invalid or false. No action will be taken."
        }
        confirmText={
          confirmModal.action === 'resolve' ? "Resolve" :
          confirmModal.action === 'remove' ? "Remove" :
          confirmModal.action === 'ban' ? "Ban User" :
          "Reject"
        }
        variant={confirmModal.action === 'ban' || confirmModal.action === 'remove' ? "destructive" : "primary"}
      />
      <div ref={bottomRef} className="h-10 flex items-center justify-center border-t border-stone-100">
        {isFetchingNextPage && <div className="h-5 w-5 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />}
      </div>
    </div>
  )
}

function ReportActions({ onAction, hasListing, hasUser }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 flex items-center justify-center rounded-xl bg-stone-50/50 border border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all active:scale-95"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-[280px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-stone-200 z-50 py-2.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right text-left">
            
            {/* Resolve */}
            <button
              onClick={() => { onAction('resolve'); setIsOpen(false) }}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors group text-left"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-stone-900">Resolve report</div>
                <div className="text-[11px] text-stone-400 leading-tight">Mark as resolved, no action taken</div>
              </div>
            </button>

            {/* Remove Listing */}
            {hasListing && (
              <button
                onClick={() => { onAction('remove'); setIsOpen(false) }}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors group text-left"
              >
                <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-stone-900">Remove listing</div>
                  <div className="text-[11px] text-stone-400 leading-tight">Delete the listing and resolve</div>
                </div>
              </button>
            )}

            {/* Ban User */}
            {hasUser && (
              <button
                onClick={() => { onAction('ban'); setIsOpen(false) }}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors group text-left"
              >
                <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <UserX className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-stone-900">Ban user</div>
                  <div className="text-[11px] text-stone-400 leading-tight">Ban user, remove all their listings</div>
                </div>
              </button>
            )}

            {/* Reject */}
            <button
              onClick={() => { onAction('reject'); setIsOpen(false) }}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors group text-left"
            >
              <div className="h-10 w-10 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-stone-900">Reject report</div>
                <div className="text-[11px] text-stone-400 leading-tight">Mark as Invalid, no action taken</div>
              </div>
            </button>

          </div>
        </>
      )}
    </div>
  )
}

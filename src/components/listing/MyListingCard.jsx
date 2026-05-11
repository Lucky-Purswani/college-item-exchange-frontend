import { useState } from 'react'
import { Database, Link as LinkIcon, Edit2, CheckCircle, Trash2, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useMarkAsSold, useDeleteListing } from '@/hooks/useListings'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export function MyListingCard({ listing }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutate: markAsSold, isPending: isMarkingSold } = useMarkAsSold()
  const { mutate: deleteListing, isPending: isDeleteMutating } = useDeleteListing()
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null })

  if (!listing) return null

  const handleMarkAsSold = () => {
    setConfirmModal({ isOpen: true, type: 'sold' })
  }

  const handleDelete = () => {
    setConfirmModal({ isOpen: true, type: 'delete' })
  }

  const onConfirm = () => {
    if (confirmModal.type === 'sold') {
      markAsSold(listing.id, { onSuccess: () => setConfirmModal({ isOpen: false, type: null }) })
    } else {
      deleteListing(listing.id, { onSuccess: () => setConfirmModal({ isOpen: false, type: null }) })
    }
  }

  const isBusy = isMarkingSold || isDeleteMutating
  const isInactive = listing.status !== "ACTIVE"

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-xl border border-stone-200 shadow-sm transition-all duration-300",
        isInactive
          ? "opacity-80"
          : "hover:shadow-md hover:border-stone-300 hover:-translate-y-0.5"
      )}
    >
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-30 rounded-xl">
          <Loader2 className="h-6 w-6 animate-spin text-stone-900" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 truncate">
                {listing.title}
              </h3>
              <div className={cn(
                "h-2 w-2 rounded-full shrink-0",
                listing.status === "ACTIVE" ? "bg-emerald-500" :
                listing.status === "SOLD" ? "bg-stone-500" :
                "bg-red-500"
              )} />
            </div>
            <p className="text-sm font-medium text-stone-500 flex items-center gap-2">
              <span className="font-bold text-stone-900">₹{listing.price}</span>
              <span className="text-stone-300">•</span>
              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Status badge for inactive */}
          {isInactive && (
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0",
              listing.status === "SOLD" ? "bg-stone-100 text-stone-600" : "bg-red-50 text-red-600"
            )}>
              {listing.status === "REMOVED" ? "REMOVED" : listing.status}
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full rounded-lg bg-stone-100 overflow-hidden shrink-0 mt-1 mb-2">
          <img
            src={listing.imageUrls?.[0] || `https://placehold.co/600x400/f5f5f4/1c1917?text=No+Image`}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {!isInactive && (
            <Link
              to="/listing/$id"
              params={{ id: listing.id }}
              className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                <LinkIcon className="h-5 w-5 text-stone-900" />
              </div>
            </Link>
          )}
          {isInactive && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
              <span className={cn(
                "text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md",
                listing.status === "SOLD" ? "bg-stone-900 text-white" : "bg-red-600 text-white"
              )}>
                {listing.status === "REMOVED" ? (
                  listing.statusDetail === "ADMIN_REMOVED" ? "Admin Removed" :
                  listing.statusDetail === "AUTO_REMOVED_BAN" ? "User Banned" :
                  listing.statusDetail === "POLICY_VIOLATION" ? "Policy Violation" :
                  listing.statusDetail === "EXPIRED" ? "Expired" :
                  "Removed"
                ) : "Sold"}
              </span>
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-1 text-stone-600">
            <Database className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{listing.category}</span>
          </div>
          
          {/* Action buttons */}
          {listing.status === "ACTIVE" && (
            <div className="flex items-center gap-1">
              <Link
                to="/listing/$id"
                params={{ id: listing.id }}
                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                title="View & Edit Listing"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={handleMarkAsSold}
                disabled={isBusy}
                title="Mark as Sold"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                onClick={handleDelete}
                disabled={isBusy}
                title="Delete Listing"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={onConfirm}
        isLoading={isBusy}
        title={confirmModal.type === 'sold' ? "Mark as Sold?" : "Delete Listing?"}
        description={
          confirmModal.type === 'sold'
            ? "Once marked as sold, this listing will be moved to your 'Sold' collection."
            : "Are you sure you want to delete this listing? This action cannot be undone."
        }
        confirmText={confirmModal.type === 'sold' ? "Mark as Sold" : "Delete"}
        variant={confirmModal.type === 'sold' ? "primary" : "destructive"}
      />
    </div>
  )
}

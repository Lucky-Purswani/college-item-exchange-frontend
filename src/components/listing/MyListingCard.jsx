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
        "group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden",
        isInactive ? "opacity-80 grayscale-[0.2]" : ""
      )}
    >
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-30">
          <Loader2 className="h-8 w-8 animate-spin text-stone-900" />
        </div>
      )}

      {/* ── Image Area (No Floating Tags) ─────────────────────────────────── */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100 shrink-0 border-b border-stone-100">
        <img
          src={listing.imageUrls?.[0] || `https://placehold.co/600x400/f5f5f4/1c1917?text=No+Image`}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Inactive Overlay */}
        {isInactive && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 pointer-events-none" />
        )}

        {/* Hover View Action (Only for active) */}
        {!isInactive && (
          <Link
            to="/listing/$id"
            params={{ id: listing.id }}
            className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center"
          >
            <div className="h-10 w-10 rounded-full bg-white/95 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <LinkIcon className="h-4 w-4 text-stone-900" />
            </div>
          </Link>
        )}
      </div>

      {/* ── Content & Actions ─────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white relative z-20">
        
        {/* Top Meta: Category & Status */}
        <div className="flex justify-between items-center mb-3">
          <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-stone-500">
            <Database className="h-3 w-3" />
            {listing.category}
          </span>
          
          <div className="flex items-center gap-1.5">
            {listing.status === "ACTIVE" && (
              <><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Active</span></>
            )}
            {listing.status === "SOLD" && (
              <><span className="h-1.5 w-1.5 rounded-full bg-stone-800" /><span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">Sold</span></>
            )}
            {listing.status === "REMOVED" && (
              <><span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                {listing.statusDetail === "ADMIN_REMOVED" ? "Admin Removed" :
                 listing.statusDetail === "AUTO_REMOVED_BAN" ? "User Banned" :
                 listing.statusDetail === "POLICY_VIOLATION" ? "Policy Violation" :
                 listing.statusDetail === "EXPIRED" ? "Expired" :
                 "Removed"}
              </span></>
            )}
          </div>
        </div>
        
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-4 mb-1">
          <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight line-clamp-1 group-hover:text-stone-700 transition-colors">
            {listing.title}
          </h3>
          <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 shrink-0">
            ₹{listing.price}
          </span>
        </div>

        {/* Date */}
        <p className="text-[11px] sm:text-xs text-stone-400 font-medium mb-5">
          Listed on {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>

        {/* Action Grid */}
        <div className="mt-auto">
          {listing.status === "ACTIVE" ? (
            <div className="grid grid-cols-3 gap-2">
              <Link
                to="/listing/$id"
                params={{ id: listing.id }}
                className="col-span-1 flex flex-col items-center justify-center gap-1 h-11 rounded-xl bg-stone-50 text-stone-600 font-semibold text-[10px] uppercase tracking-wider hover:bg-stone-100 hover:text-stone-900 transition-all border border-transparent hover:border-stone-200"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={handleMarkAsSold}
                disabled={isBusy}
                className="col-span-1 flex flex-col items-center justify-center gap-1 h-11 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-[10px] uppercase tracking-wider hover:bg-emerald-100 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-200 disabled:opacity-50"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Sold
              </button>
              <button
                onClick={handleDelete}
                disabled={isBusy}
                className="col-span-1 flex flex-col items-center justify-center gap-1 h-11 rounded-xl bg-red-50 text-red-600 font-semibold text-[10px] uppercase tracking-wider hover:bg-red-100 hover:text-red-700 transition-all border border-transparent hover:border-red-200 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-11 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest shadow-sm">
              Listing Closed
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

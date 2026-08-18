import React, { memo, useState, useCallback } from "react"
import { Tag, ShieldCheck, Flag, Trash2, ChevronLeft, ChevronRight, CheckCircle2, Pencil, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAdminDeleteListing } from "@/hooks/useAdmin"
import { useRouter, Link } from "@tanstack/react-router"
import ReportModal from "@/components/common/ReportModal"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { useCreateInteraction } from "@/hooks/useConversations"
import { toast } from 'sonner'
import { useSwipeable } from 'react-swipeable'

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const ListingDetail = memo(function ListingDetail({ listing }) {
  const { user } = useAuth()
  const router = useRouter()
  
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const { mutateAsync: createInteraction, isPending: isStartingChat } = useCreateInteraction()

  const handleContactSeller = async () => {
    try {
      const interaction = await createInteraction(listing.id)
      router.navigate({ to: '/chat/$id', params: { id: interaction.id } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start conversation')
    }
  }

  const { mutate: adminDelete, isPending: isAdminDeleting } = useAdminDeleteListing()

  if (!listing) return null

  const isOwner = user?.id === listing.user?.id || user?.id === listing.userId
  const isAdmin = user?.role === "ADMIN"

  const images = listing.imageUrls?.length > 0
    ? listing.imageUrls
    : ["https://placehold.co/800x800/f5f5f4/1c1917?text=No+Image"]

  const prev = useCallback(
    () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  )
  
  const next = useCallback(
    () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  )

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => images.length > 1 && next(),
    onSwipedRight: () => images.length > 1 && prev(),
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  const handleAdminDelete = () => setIsConfirmOpen(true)

  const onConfirmDelete = () => {
    adminDelete(
      listing.id,
      {
        onSuccess: () => { 
          setIsConfirmOpen(false)
          toast.success("Listing removed successfully")
          router.navigate({ to: '/home' }) 
        },
        onError: (err) => {
          setIsConfirmOpen(false)
          toast.error(err.response?.data?.message || "Failed to remove listing")
        },
      }
    )
  }

  const initials = listing.user?.displayName?.[0]?.toUpperCase() || "S"
  const displayName = listing.user?.displayName || "student"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Modals */}
      <ReportModal listingId={listing.id} open={reportModalOpen} onOpenChange={setReportModalOpen} />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        isLoading={isAdminDeleting}
        title="Admin Override: Remove Listing"
        description="Are you absolutely sure you want to permanently remove this listing? This action cannot be undone."
        confirmText="Remove Listing"
        variant="destructive"
      />

      {/* ── LEFT: Image carousel ── */}
      <div className="space-y-4">
        <div 
          {...swipeHandlers}
          className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 group border border-stone-200 shadow-sm"
        >
          <img
            src={images[activeIndex]}
            alt={listing.title}
            className="object-cover w-full h-full transition-opacity duration-300 pointer-events-none select-none"
          />
          {images.length > 1 && (
            <>
              <button 
                onClick={prev} 
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-md border border-stone-200"
              >
                <ChevronLeft className="h-5 w-5 pr-0.5" />
              </button>
              <button 
                onClick={next} 
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-900 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-md border border-stone-200"
              >
                <ChevronRight className="h-5 w-5 pl-0.5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-black/20 backdrop-blur-md">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveIndex(i)} 
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 rounded-full transition-all shadow-sm ${i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"}`} 
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex ? "border-stone-900 ring-2 ring-stone-900/20 opacity-100" : "border-transparent opacity-60 hover:opacity-100 bg-stone-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${i+1}`} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: Clean scannable info ── */}
      <div className="flex flex-col gap-6">

        {/* Block 1 — Title + Price */}
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              listing.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}>
              {listing.status === "ACTIVE" ? (
                <>
                  <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ACTIVE
                </>
              ) : (
                listing.status === "REMOVED" ? (
                  listing.statusDetail === "ADMIN_REMOVED" ? "Admin Removed" :
                  listing.statusDetail === "AUTO_REMOVED_BAN" ? "User Banned" :
                  listing.statusDetail === "POLICY_VIOLATION" ? "Policy Violation" :
                  listing.statusDetail === "EXPIRED" ? "Expired" :
                  "Removed"
                ) : listing.status
              )}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight">
            {listing.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-3xl font-bold text-stone-900">{formatPrice(listing.price)}</span>
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Fixed Price</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200" />

        {/* Block 2 — Category + Listed On */}
        <div className="grid grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Category</p>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-stone-600" />
              <p className="text-sm font-semibold text-stone-900">{listing.category}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Listed On</p>
            <p className="text-sm font-semibold text-stone-900">{formatDate(listing.createdAt)}</p>
          </div>
        </div>

        {/* Block 3 — Seller */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Seller Information</p>
          <div className="flex items-center gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 text-lg font-bold shrink-0 border border-stone-200">
              {initials}
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-stone-900">{displayName}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Member
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  College Authentic
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200" />

        {/* Block 4 — Description */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Description</p>
          <p className="text-sm md:text-base text-stone-700 leading-relaxed whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200" />

        {/* Block 5 — CTA */}
        <div className="space-y-4 pt-2">
          {isOwner ? (
            <Link
              to="/listing/$id/edit"
              params={{ id: listing.id }}
              className="w-full h-12 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 bg-stone-900 text-white hover:bg-stone-800"
            >
              <Pencil className="h-4 w-4" />
              Edit Your Listing
            </Link>
          ) : (
            <button
              className="w-full h-12 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-stone-900 text-white hover:bg-stone-800"
              disabled={listing.status !== 'ACTIVE' || isStartingChat}
              onClick={handleContactSeller}
            >
              {isStartingChat ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : listing.status !== 'ACTIVE' ? (
                'Listing Unavailable'
              ) : (
                'Contact Seller'
              )}
            </button>
          )}

          {!isOwner && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors mx-auto w-fit justify-center bg-stone-50 hover:bg-red-50 px-3 py-1.5 rounded-md"
            >
              <Flag className="h-3.5 w-3.5" />
              Report this listing
            </button>
          )}
        </div>

        {/* Admin delete */}
        {isAdmin && !isOwner && (
          <div className="pt-4 border-t border-stone-200 mt-2">
            <button
              className="w-full h-10 rounded-lg px-4 text-xs font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleAdminDelete}
              disabled={isAdminDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Admin Override: Delete Listing
            </button>
          </div>
        )}
      </div>
    </div>
  )
})

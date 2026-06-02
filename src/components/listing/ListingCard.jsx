import { Database, Link as LinkIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function ListingCard({ listing }) {
  if (!listing) return null

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200 shadow-sm transition-all hover:shadow-md hover:border-stone-300"
    >
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold tracking-tight text-stone-900 line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
              <span className="font-semibold text-emerald-600">{formatPrice(listing.price)}</span>
              <span className="text-stone-300">•</span>
              <span>
                {new Date(listing.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full rounded-lg border border-stone-100 bg-stone-50 overflow-hidden shrink-0">
          <img
            src={listing.imageUrls?.[0] || 'https://placehold.co/600x400/f5f5f4/1c1917?text=No+Image'}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="h-10 w-10 rounded-full bg-white/90 border border-stone-200/50 flex items-center justify-center shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
              <LinkIcon className="h-4 w-4 text-stone-700" />
            </div>
          </div>
        </div>

        {/* Badge & User Info */}
        <div className="flex mt-auto pt-2 items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-1 text-stone-600">
            <Database className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{listing.category}</span>
          </div>
          <div className="text-[10px] text-stone-400 font-medium">
            {listing.user?.displayName || 'User'}
          </div>
        </div>
      </div>
    </Link>
  )
}

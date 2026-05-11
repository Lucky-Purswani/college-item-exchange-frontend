import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PlusCircle, ShoppingBag } from 'lucide-react'
import { useMyListings } from '@/hooks/useListings'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { PageShell } from '@/components/layout/PageShell'
import { MyListingCard } from '@/components/listing/MyListingCard'
import { PageLoader } from '@/components/loading'

export const Route = createFileRoute('/_protected/my-listings')({
  component: MyListingsPage,
})

function MyListingsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useMyListings()

  const [bottomRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 })

  // Trigger infinite scroll
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isError) {
    return (
      <PageShell className="py-20 text-center">
        <p className="text-red-500 font-medium">Failed to load your listings. Please try again.</p>
      </PageShell>
    )
  }

  const listings = data?.pages.flatMap((page) => page.data) || []
  const totalListings = data?.pages[0]?.pagination?.total || 0

  if (!isPending && listings.length === 0) {
    return (
      <PageShell fill className="flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
            <ShoppingBag className="h-6 w-6 text-stone-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">No listings yet</h2>
          <p className="text-sm text-stone-500 mb-8">
            You haven&apos;t posted any items for sale. Start clearing your room today!
          </p>
          <Link
            to="/listing/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold shadow-md hover:bg-stone-800 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="h-4 w-4" />
            Create First Listing
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">My Listings</h1>
            {totalListings > 0 && (
              <span className="inline-flex items-center justify-center rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-600">
                {totalListings}
              </span>
            )}
          </div>
          <p className="text-stone-500 mt-1">Manage and track all your items in one place.</p>
        </div>
        
        <Link
          to="/listing/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-semibold text-white shadow-md hover:bg-stone-800 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          Post New Item
        </Link>
      </div>

      {/* Grid */}
      {isPending ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
          
          {/* Infinite Scroll Trigger */}
          <div ref={bottomRef} className="col-span-full h-10 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="h-5 w-5 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
            )}
          </div>
        </div>
      )}
    </PageShell>
  )
}

import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'

import { useListings } from '@/hooks/useListings'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { PageShell } from '@/components/layout/PageShell'
import { ListingCard } from '@/components/listing/ListingCard'
import { PageLoader } from '@/components/loading'

export const Route = createFileRoute('/_protected/listings')({
  component: ListingsPage,
})

function ListingsPage() {
  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState('date_desc')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useListings({
    // Pass undefined (not '') so empty search is omitted from the query params
    search: debouncedSearch || undefined,
    category: category === 'ALL' ? undefined : category,
    sort,
  })

  // Intersection observer for infinite scroll trigger
  const [bottomRef, isIntersecting] = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten pages
  const listings = data?.pages.flatMap((page) => page.data) || []

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Marketplace</h1>
        <p className="text-stone-500 mt-1">Discover items from your peers across campus.</p>
      </div>

      {/* Filter Workbench */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-3 bg-white border border-stone-200 p-2 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full flex items-center bg-stone-50 rounded-lg border border-stone-200 px-3 transition-colors focus-within:border-stone-400 focus-within:bg-white">
          <Search className="h-4 w-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full bg-transparent pl-2 outline-none text-sm text-stone-900 placeholder:text-stone-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="hidden md:block h-6 w-px bg-stone-200 mx-2" />

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-[150px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-8 text-xs font-semibold uppercase tracking-wide text-stone-700 outline-none hover:bg-stone-100 transition-colors focus:border-stone-400"
            >
              <option value="ALL">All Categories</option>
              <option value="TEXTBOOKS">Textbooks</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="FURNITURE">Furniture</option>
              <option value="TRANSPORTATION">Transportation</option>
              <option value="STATIONERY">Stationery</option>
              <option value="CLOTHING">Clothing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-[160px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-8 text-xs font-semibold uppercase tracking-wide text-stone-700 outline-none hover:bg-stone-100 transition-colors focus:border-stone-400"
            >
              <option value="date_desc">Most Recent</option>
              <option value="date_asc">Oldest First</option>
              <option value="price_asc">Price: Low - High</option>
              <option value="price_desc">Price: High - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isPending ? (
        <PageLoader />
      ) : isError ? (
        <div className="py-20 text-center">
          <p className="text-red-500 font-medium">Failed to load listings. Please try again.</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          
          {/* Infinite Scroll Trigger */}
          <div ref={bottomRef} className="col-span-full h-10 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="h-5 w-5 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
            )}
          </div>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900">No listings found</h3>
          <p className="text-sm text-stone-500 mt-1 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setCategory('ALL')
            }}
            className="text-sm font-medium text-stone-900 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </PageShell>
  )
}

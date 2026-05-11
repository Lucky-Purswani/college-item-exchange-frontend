import React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useListing } from '@/hooks/useListings'
import { PageShell } from '@/components/layout/PageShell'
import { ListingDetail } from '@/components/listing/ListingDetail'
import { PageLoader } from '@/components/loading'

export const Route = createFileRoute('/_protected/listing/$id')({
  component: ListingDetailPage,
})

function ListingDetailPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  
  const { data: response, isLoading, isError, error } = useListing(id)

  if (isLoading) return <PageLoader />
  
  if (isError) {
    return (
      <PageShell>
        <div className="py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Failed to load listing</h2>
          <p className="text-stone-500 mb-6">{error?.response?.data?.message || 'Something went wrong while fetching the data.'}</p>
          <button 
            onClick={() => router.history.back()}
            className="h-10 px-6 rounded-lg bg-stone-900 text-white font-semibold text-sm shadow-sm"
          >
            Go Back
          </button>
        </div>
      </PageShell>
    )
  }

  const listing = response?.data
  if (!listing) {
    return (
      <PageShell>
        <div className="py-20 text-center text-stone-500 font-medium">
          Listing data is currently unavailable.
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <button 
        onClick={() => router.history.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors group"
      >
        <div className="p-1.5 rounded-lg border border-stone-200 group-hover:bg-stone-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to listings
      </button>

      <ListingDetail listing={listing} />
    </PageShell>
  )
}

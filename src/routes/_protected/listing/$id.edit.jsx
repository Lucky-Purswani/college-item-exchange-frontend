import React, { useEffect } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Loader2, Save, Tag, FileText, IndianRupee, AlignLeft } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/hooks/useAuth'
import { useListing, useUpdateListing } from '@/hooks/useListings'
import { PageLoader } from '@/components/loading'

export const Route = createFileRoute('/_protected/listing/$id/edit')({
  component: EditListingPage,
})

const CATEGORIES = [
  { value: 'BOOKS', label: 'Books' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'STATIONERY', label: 'Stationery' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'CYCLE', label: 'Cycles' },
  { value: 'OTHER', label: 'Other' },
]

const editSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  price: z.coerce.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be greater than 0'),
  category: z.enum(['BOOKS', 'ELECTRONICS', 'STATIONERY', 'FURNITURE', 'CYCLE', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
})

function EditListingPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const { user } = useAuth()

  const { data: response, isLoading, isError } = useListing(id)
  const { mutate: updateListing, isPending, isSuccess } = useUpdateListing()

  const [successMsg, setSuccessMsg] = React.useState('')
  const [errorMsg, setErrorMsg] = React.useState('')

  const listing = response?.data

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
    },
  })

  // Populate form once listing loads
  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
      })
    }
  }, [listing, reset])

  // Redirect if not owner
  useEffect(() => {
    if (listing && user && listing.user?.id !== user.id && listing.userId !== user.id) {
      router.navigate({ to: '/listing/$id', params: { id } })
    }
  }, [listing, user, id, router])

  const description = watch('description', '')

  const onSubmit = (data) => {
    setErrorMsg('')
    setSuccessMsg('')
    updateListing(
      { id, data },
      {
        onSuccess: () => {
          setSuccessMsg('Listing updated successfully!')
          setTimeout(() => {
            router.navigate({ to: '/listing/$id', params: { id } })
          }, 1200)
        },
        onError: (err) => {
          setErrorMsg(err.response?.data?.message || 'Failed to update listing. Please try again.')
        },
      }
    )
  }

  if (isLoading) return <PageLoader />

  if (isError || !listing) {
    return (
      <PageShell>
        <div className="py-20 text-center text-stone-500">
          Listing not found or unavailable.
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 space-y-4">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors group"
        >
          <div className="p-1.5 rounded-lg border border-stone-200 group-hover:bg-stone-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Listing
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">Edit Listing</h1>
          <p className="text-sm text-stone-500 mt-1">Update the details of your listing below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">

          {/* Feedback messages */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-stone-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Title</h2>
            </div>
            <div className="space-y-2">
              <input
                {...register('title')}
                placeholder="e.g. Physics Textbook, Dell Laptop, Study Chair..."
                className={`w-full h-11 px-4 rounded-lg border text-sm text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                  errors.title ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                }`}
              />
              {errors.title && (
                <p className="text-xs font-semibold text-red-500">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <IndianRupee className="h-4 w-4 text-stone-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Price (₹)</h2>
              </div>
              <div className="space-y-2">
                <input
                  type="number"
                  step="1"
                  min="1"
                  {...register('price')}
                  placeholder="e.g. 500"
                  className={`w-full h-11 px-4 rounded-lg border text-sm text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 ${
                    errors.price ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                />
                {errors.price && (
                  <p className="text-xs font-semibold text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="h-4 w-4 text-stone-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Category</h2>
              </div>
              <div className="space-y-2">
                <select
                  {...register('category')}
                  className={`w-full h-11 px-4 rounded-lg border text-sm text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 appearance-none bg-no-repeat ${
                    errors.category ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23777' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center' }}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs font-semibold text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-stone-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Description</h2>
              </div>
              <span className={`text-xs font-semibold tabular-nums ${description.length > 900 ? 'text-red-500' : 'text-stone-400'}`}>
                {description.length} / 1000
              </span>
            </div>
            <div className="space-y-2">
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Describe the condition, age, any accessories included, reason for selling..."
                className={`w-full px-4 py-3 rounded-lg border text-sm text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 resize-none ${
                  errors.description ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                }`}
              />
              {errors.description && (
                <p className="text-xs font-semibold text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.history.back()}
              className="h-11 px-6 rounded-lg border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="h-11 px-8 rounded-lg bg-stone-900 text-white text-sm font-bold shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── SIDEBAR: Current Image Preview ── */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">Current Images</h2>
            {listing.imageUrls?.length > 0 ? (
              <div className="space-y-3">
                {listing.imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-stone-100 bg-stone-50">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-stone-700 px-2 py-0.5 rounded-md shadow-sm border border-stone-200">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-stone-50 border border-dashed border-stone-300 flex items-center justify-center">
                <p className="text-xs text-stone-400 font-medium">No images uploaded</p>
              </div>
            )}
            <p className="text-xs text-stone-400 leading-relaxed">
              Image editing is not supported in this update. To change images, please delete and re-create the listing.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-1">Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Only the <strong>title</strong>, <strong>description</strong>, <strong>price</strong>, and <strong>category</strong> can be edited. The listing status and images remain unchanged.
            </p>
          </div>
        </div>

      </div>
    </PageShell>
  )
}

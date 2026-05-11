import React, { useState, useCallback } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ArrowLeft, Loader2, Upload, X, ImagePlus
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useCreateListing } from '@/hooks/useListings'
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected/listing/new')({
  component: NewListingPage,
})

const CATEGORIES = [
  { value: 'BOOKS', label: '📚 Books' },
  { value: 'ELECTRONICS', label: '💻 Electronics' },
  { value: 'STATIONERY', label: '✏️ Stationery' },
  { value: 'FURNITURE', label: '🪑 Furniture' },
  { value: 'CYCLE', label: '🚲 Cycle' },
  { value: 'OTHER', label: '📦 Other' },
]

const schema = z.object({
  title: z.string().min(3, 'At least 3 characters').max(100, 'Max 100 characters'),
  description: z.string().min(10, 'At least 10 characters').max(1000, 'Max 1000 characters'),
  price: z.coerce
    .number({ invalid_type_error: 'Enter a valid number' })
    .positive('Must be greater than 0'),
  category: z.enum(['BOOKS', 'ELECTRONICS', 'STATIONERY', 'FURNITURE', 'CYCLE', 'OTHER'], {
    errorMap: () => ({ message: 'Select a category' }),
  }),
})

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.7);
      };
    };
  });
};

function NewListingPage() {
  const router = useRouter()
  const { mutate: createListing, isPending } = useCreateListing()

  const [images, setImages] = useState([])       // File[]
  const [previews, setPreviews] = useState([])   // string[] (object URLs)
  const [dragOver, setDragOver] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', price: '', category: '' },
  })

  const description = watch('description', '')

  // ── Image handling ──────────────────────────────────────────────
  const addFiles = useCallback((files) => {
    const remaining = 3 - images.length
    if (remaining <= 0) return
    const toAdd = Array.from(files).slice(0, remaining).filter((f) =>
      f.type.startsWith('image/')
    )
    if (!toAdd.length) return
    setImages((prev) => [...prev, ...toAdd])
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))])
  }, [images.length])

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.target.files)
  }

  // ── Submit ───────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    // Compress images before sending
    let processedImages = images;
    if (images.length > 0) {
      try {
        processedImages = await Promise.all(images.map(img => compressImage(img)));
      } catch (err) {
        console.error('Compression failed', err);
      }
    }

    createListing(
      { ...data, images: processedImages },
      {
        onSuccess: (res) => {
          setSuccess(true)
          toast.success("Listing published successfully!")
          const newId = res?.data?.id
          setTimeout(() => {
            router.navigate({ to: '/my-listings' })
          }, 1200)
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to create listing.')
        },
      }
    )
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 space-y-3">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors group"
        >
          <div className="p-1.5 rounded-lg border border-stone-200 group-hover:bg-stone-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
            Post an Item
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Fill in the details below to list your item on the marketplace.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT COLUMN: main fields ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Title */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. Introduction to Algorithms, 3rd Ed."
                className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 ${
                  errors.title ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                }`}
              />
              {errors.title && (
                <p className="text-xs font-semibold text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Price + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  {...register('price')}
                  placeholder="e.g. 350"
                  className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 ${
                    errors.price ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                />
                {errors.price && (
                  <p className="text-xs font-semibold text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Category
                </label>
                <select
                  {...register('category')}
                  className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 appearance-none ${
                    errors.category ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                  }`}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs font-semibold text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Description
                </label>
                <span className={`text-xs font-semibold tabular-nums ${description.length > 900 ? 'text-red-500' : 'text-stone-400'}`}>
                  {description.length}/1000
                </span>
              </div>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe condition, age, reason for selling, accessories included..."
                className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 resize-none ${
                  errors.description ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-stone-50 focus:bg-white'
                }`}
              />
              {errors.description && (
                <p className="text-xs font-semibold text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => router.history.back()}
                className="h-10 px-5 rounded-lg border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || success}
                className="h-10 px-7 rounded-lg bg-stone-900 text-white text-sm font-bold shadow-sm hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Post Listing
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: image upload ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Photos
                </label>
                <span className="text-xs text-stone-400 font-medium">{images.length} / 3</span>
              </div>

              {/* Drop zone */}
              {images.length < 3 && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer ${
                    dragOver
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50/60'
                  }`}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
                    <ImagePlus className="h-5 w-5 text-stone-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-stone-700">
                      {dragOver ? 'Drop to upload' : 'Upload photos'}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Drag & drop or click · PNG, JPG, WEBP
                    </p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>
              )}

              {/* Preview grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 group">
                      <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 text-[9px] font-bold bg-stone-900 text-white px-1.5 py-0.5 rounded-sm">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white/90 flex items-center justify-center text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previews.length === 0 && images.length === 0 && (
                <p className="text-xs text-stone-400 text-center pb-1">
                  Photos are optional but strongly recommended.
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-stone-700">Quick Tips</p>
              <ul className="text-xs text-stone-500 space-y-1 leading-relaxed">
                <li>• First photo is shown as the cover image</li>
                <li>• Good lighting improves buyer interest</li>
                <li>• Be honest about the item's condition</li>
                <li>• Set a fair price — compare similar listings</li>
              </ul>
            </div>
          </div>

        </div>
      </form>
    </PageShell>
  )
}

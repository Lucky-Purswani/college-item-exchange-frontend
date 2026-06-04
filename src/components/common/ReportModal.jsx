import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, ShieldAlert, AlertTriangle } from 'lucide-react'
import { useCreateReport } from '@/hooks/useReport'
import { toast } from 'sonner'

export default function ReportModal({ listingId, open, onOpenChange }) {
  const [reason, setReason] = useState('')
  
  const { mutate: createReport, isPending } = useCreateReport()

  // Lock scroll when dialog is open
  useEffect(() => {
    if (open) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [open]);

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (reason.length < 5) {
      toast.error('Please provide a more detailed reason (min 5 characters)')
      return
    }

    createReport(
      { listingId, reason },
      {
        onSuccess: () => {
          toast.success('Listing reported successfully. Our moderation team will review it shortly.')
          setReason('')
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.')
        },
      }
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-2 mb-6">
            <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Report Listing</h2>
            <p className="text-sm text-stone-500">
              Help us keep the marketplace safe. Tell us what's wrong with this listing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Reason for reporting
                </label>
                <span className={`text-[10px] font-bold tabular-nums ${reason.length >= 500 ? 'text-red-500' : 'text-stone-400'}`}>
                  {reason.length}/500
                </span>
              </div>
              <textarea
                id="reason"
                placeholder="e.g. This is a scam, inappropriate content, or duplicate post..."
                className="w-full min-h-[120px] rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 transition-colors resize-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 h-10 rounded-lg text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 h-10 rounded-lg bg-stone-900 text-white text-sm font-semibold shadow-sm hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

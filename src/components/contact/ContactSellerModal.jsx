import React, { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { useContactSeller } from '@/hooks/useContact'
import { toast } from 'sonner'

export default function ContactSellerModal({ listingId, listingTitle, open, onOpenChange }) {
  const [message, setMessage] = useState('')
  
  const { mutate: sendMessage, isPending } = useContactSeller()

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (message.trim().length < 10) {
      toast.error('Message must be at least 10 characters long.')
      return
    }

    sendMessage(
      { listingId, message },
      {
        onSuccess: () => {
          toast.success('Your message has been sent successfully!')
          setMessage('')
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Contact Seller</h2>
            <p className="text-sm text-stone-500">
              Sending an inquiry for <span className="font-semibold text-stone-900">"{listingTitle}"</span>. 
              The seller will receive your message via email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <textarea
                placeholder="Hi! I'm interested in this item. Is it still available?"
                className="w-full min-h-[150px] rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900 transition-colors resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isPending}
                maxLength={1000}
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
                disabled={isPending || message.trim().length < 10}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

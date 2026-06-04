import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


/**
 * A minimalist, Shadcn-inspired confirmation dialog.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive", // "destructive" | "primary"
  isLoading = false,
}) {
  // Lock scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 z-0"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Dialog */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-md rounded-[24px] border border-stone-200 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in zoom-in-95 fade-in duration-200",
          "flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            variant === 'destructive' ? "bg-red-50" : "bg-stone-50"
          )}>
            <AlertTriangle className={cn(
              "h-5 w-5",
              variant === 'destructive' ? "text-red-600" : "text-stone-600"
            )} />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-stone-900 leading-none">
              {title}
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-stone-200 text-stone-700 hover:bg-stone-50 h-10"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "h-10 min-w-[100px]",
              variant === 'destructive' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-stone-900 hover:bg-stone-800 text-white"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

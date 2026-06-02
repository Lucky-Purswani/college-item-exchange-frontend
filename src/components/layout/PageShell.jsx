import { cn } from '@/lib/utils'

/**
 * PageShell — max-width container with consistent padding
 */
export function PageShell({ className, children, fill = false, ...props }) {
  return (
    <main
      className={cn(
        'mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col',
        fill && 'flex-1',
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

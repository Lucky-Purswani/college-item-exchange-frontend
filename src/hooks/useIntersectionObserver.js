import { useCallback, useState } from 'react'

/**
 * Returns a [callbackRef, isIntersecting] tuple.
 * Uses a callback ref (not useRef) so the observer is guaranteed to attach
 * AFTER the DOM element actually mounts — avoiding the ref race condition.
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0,
    // Caller options override defaults
    ...options,
  }

  const callbackRef = useCallback((node) => {
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, observerOptions)

    observer.observe(node)

    // Cleanup when the element unmounts
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerOptions.root, observerOptions.rootMargin, observerOptions.threshold])

  return [callbackRef, isIntersecting]
}

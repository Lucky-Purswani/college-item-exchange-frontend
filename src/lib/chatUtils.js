/**
 * CHAT UTILITIES
 * Date/time formatters used across chat components.
 */

/**
 * Returns a human-friendly relative time string (e.g. "5 min ago", "2 days ago").
 * Used in conversation list previews.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDistanceToNow(dateInput) {
  const date = new Date(dateInput)
  const now = new Date()
  const diffMs = now - date

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m`
  if (diffHr < 24) return `${diffHr}h`
  if (diffDay < 7) return `${diffDay}d`

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/**
 * Returns a time string like "10:45 AM" for use inside a message bubble.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatTime(dateInput) {
  return new Date(dateInput).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

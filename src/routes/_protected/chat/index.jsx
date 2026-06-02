import { createFileRoute, Link } from '@tanstack/react-router'
import { MessageSquare, Loader2, ChevronRight } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useConversations } from '@/hooks/useConversations'
import { useAuth } from '@/hooks/useAuth'
import { formatDistanceToNow } from '@/lib/chatUtils'

export const Route = createFileRoute('/_protected/chat/')({
  component: ChatInboxPage,
})

function ChatInboxPage() {

  const { data, isLoading, isError } = useConversations()
  const { user } = useAuth()

  const conversations = data?.data ?? []

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageShell fill className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </PageShell>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <PageShell className="py-20 text-center">
        <p className="text-sm text-stone-500">Failed to load messages. Please try again.</p>
      </PageShell>
    )
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (conversations.length === 0) {
    return (
      <PageShell fill className="flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-7 w-7 text-stone-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">No conversations yet</h2>
          <p className="text-sm text-stone-500 mb-6">
            Browse listings and tap <strong>Contact Seller</strong> to start a conversation.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Messages</h1>
        <p className="text-sm text-stone-500 mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversation list */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
        {conversations.map((conv) => {
          const isUserBuyer = conv.buyer?.id === user?.id
          const otherPerson = isUserBuyer ? conv.seller : conv.buyer
          const initials = otherPerson?.displayName?.[0]?.toUpperCase() || '?'
          const unread = conv.unreadCount ?? 0

          return (
            <Link
              key={conv.id}
              to="/chat/$id"
              params={{ id: conv.id }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors group"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-11 w-11 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-base">
                  {initials}
                </div>
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm font-semibold truncate ${unread > 0 ? 'text-stone-900' : 'text-stone-700'}`}>
                    {otherPerson?.displayName || 'Unknown'}
                  </span>
                  {conv.lastMessageAt && (
                    <span className="text-xs text-stone-400 shrink-0">
                      {formatDistanceToNow(conv.lastMessageAt)}
                    </span>
                  )}
                </div>

                {/* Listing title */}
                <p className="text-xs text-stone-400 truncate mb-1">
                  📦 {conv.listing?.title || 'Listing'}
                </p>

                {/* Last message preview */}
                <p className={`text-xs truncate ${unread > 0 ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
                  {conv.lastMessage
                    ? (conv.lastMessageSender === user?.id ? 'You: ' : '') + conv.lastMessage
                    : 'No messages yet — say hi!'}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}

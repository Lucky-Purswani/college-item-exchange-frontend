import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Send, Loader2, AlertCircle, Package } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { formatTime, formatDistanceToNow } from '@/lib/chatUtils'

export const Route = createFileRoute('/_protected/chat/$id')({
  component: ChatRoomPage,
})

function ChatRoomPage() {
  const { id: interactionId } = Route.useParams()
  const router = useRouter()
  const { user } = useAuth()

  const { data: conversationsData } = useConversations()
  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    isSending,
    emitTypingStart,
    emitTypingStop,
  } = useChat(interactionId)

  const [input, setInput] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [navbarHeight, setNavbarHeight] = useState(64)
  const bottomRef = useRef(null)

  // Dynamically measure the real navbar height to anchor the chat container
  useEffect(() => {
    const navbar = document.getElementById('app-navbar')
    if (!navbar) return
    setNavbarHeight(navbar.getBoundingClientRect().height)
    const observer = new ResizeObserver((entries) => {
      setNavbarHeight(entries[0].contentRect.height)
    })
    observer.observe(navbar)
    return () => observer.disconnect()
  }, [])

  // Find current conversation metadata from the inbox cache
  const conversation = conversationsData?.data?.find((c) => c.id === interactionId)
  const isUserBuyer = conversation?.buyer?.id === user?.id
  const otherPerson = isUserBuyer ? conversation?.seller : conversation?.buyer
  const listing = conversation?.listing

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // ── Send handler ───────────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    setInput('')
    emitTypingStop()
    clearTimeout(typingTimeout)

    try {
      await sendMessage(trimmed)
    } catch {
      // Error is handled by the mutation — optimistic rollback happens automatically
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Typing indicator emit ──────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value)

    // Debounce typing stop
    clearTimeout(typingTimeout)
    emitTypingStart()
    const t = setTimeout(() => emitTypingStop(), 2000)
    setTypingTimeout(t)
  }

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
      <PageShell fill className="flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-8 w-8 text-stone-300" />
        <p className="text-sm text-stone-500">Could not load this conversation.</p>
        <button
          onClick={() => router.history.back()}
          className="text-xs font-semibold text-stone-900 underline underline-offset-2"
        >
          Go back
        </button>
      </PageShell>
    )
  }

  return (
    // Fixed positioning below navbar to prevent mobile scroll shifts
    <div
      className="fixed inset-x-0 bottom-0 flex flex-col bg-stone-50"
      style={{ top: `${navbarHeight}px` }}
    >
      <div className="flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 py-4 border-b border-stone-200 shrink-0">
        <button
          onClick={() => router.navigate({ to: '/chat' })}
          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm shrink-0">
          {otherPerson?.displayName?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Name + listing */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-stone-900 truncate">
            {otherPerson?.displayName || 'Unknown'}
          </p>
          {listing && (
            <Link
              to="/listing/$id"
              params={{ id: listing.id }}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors truncate"
            >
              <Package className="h-3 w-3 shrink-0" />
              <span className="truncate">{listing.title}</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div className={`chat-scrollbar flex-1 py-1 space-y-2 ${
        messages.length > 0 ? 'overflow-y-auto scroll-smooth' : 'overflow-hidden'
      }`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-12">
            <p className="text-2xl">👋</p>
            <p className="text-sm font-medium text-stone-700">
              Say hi to {otherPerson?.displayName || 'the seller'}!
            </p>
            <p className="text-xs text-stone-400">Messages are only visible to you two.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?.id || msg._optimistic
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMine={isMine}
                senderName={msg.sender?.displayName}
              />
            )
          })
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ──────────────────────────────────────────────────────── */}
      <div className="py-3 border-t border-stone-200 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            disabled={isSending}
            maxLength={1000}
            className="flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 transition-colors disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="h-[42px] w-[42px] rounded-xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-1.5 text-center">
          Press <kbd className="px-1 py-0.5 rounded bg-stone-100 text-stone-500 text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-stone-100 text-stone-500 text-[10px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
    </div>
  )
}

// ── Message Bubble component ──────────────────────────────────────────────────
function MessageBubble({ message, isMine, senderName }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] sm:max-w-[60%] space-y-1 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isMine
              ? 'bg-stone-900 text-white rounded-br-sm'
              : 'bg-stone-100 text-stone-900 rounded-bl-sm'
          } ${message._optimistic ? 'opacity-70' : ''}`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-stone-400 px-1">
          {message._optimistic ? 'Sending…' : formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}

import { useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/contexts/SocketContext'
import { SOCKET_EVENTS } from '@/lib/socketEvents'
import {
  getInteractionMessages,
  sendMessage as sendMessageApi,
  markAsRead,
} from '@/api/interaction.api'
import { useAuthStore } from '@/store/auth.store'

/**
 * USECHAT HOOK
 *
 * The main hook for a single open conversation.
 * Handles:
 *  - HTTP fetch of message history (paginated, TanStack Query cached)
 *  - Socket room join/leave lifecycle
 *  - Real-time NEW_MESSAGE injection into the query cache (no full refetch)
 *  - Sending messages with optimistic updates
 *  - Typing indicator emit helpers
 *  - Mark-as-read on open (best-effort, non-blocking)
 *
 * @param {string|null} interactionId  Pass null to disable (e.g. no conversation selected)
 */
export function useChat(interactionId) {
  const socket = useSocket()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const queryKey = ['messages', interactionId]

  // Track the latest queryKey in a ref so socket callbacks don't go stale
  const queryKeyRef = useRef(queryKey)
  queryKeyRef.current = queryKey

  // ── 1. Fetch message history ───────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuery({
    queryKey,
    queryFn: () => getInteractionMessages(interactionId),
    enabled: !!interactionId,
    // staleTime 0 — real-time socket events keep the cache fresh,
    // but we want the initial load to always be fresh from the server
    staleTime: 0,
  })

  const messages = data?.data ?? []
  const pagination = data?.pagination ?? null

  // ── 2. Socket room lifecycle ────────────────────────────────────────────────
  useEffect(() => {
    if (!interactionId || !socket) return

    // Join the room so we receive NEW_MESSAGE events for this conversation
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, interactionId)

    // Mark conversation as read when opened — best-effort, don't block UI
    markAsRead(interactionId)
      .then(() => {
        // Refresh inbox so the unread badge clears immediately
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      })
      .catch(() => {}) // non-fatal

    // Listen for real-time messages and inject into the query cache
    const handleNewMessage = (newMessage) => {
      // 🚨 Fix for duplication: 
      // If we sent this message, our mutation's onSuccess will handle it.
      // We don't need the socket to echo it back to us, which causes the double bubble.
      if (newMessage.senderId === user?.id) return

      queryClient.setQueryData(queryKeyRef.current, (prev) => {
        if (!prev) return { data: [newMessage], pagination: null }

        // Extra safety check to prevent duplicates
        const alreadyExists = prev.data.some((m) => m.id === newMessage.id)
        if (alreadyExists) return prev

        return { ...prev, data: [...prev.data, newMessage] }
      })

      // Also refresh conversations inbox to update lastMessage preview + unread count
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    // When the socket reconnects after an internet drop, refetch history to catch missed messages
    const handleReconnect = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, interactionId)
      queryClient.invalidateQueries({ queryKey: queryKeyRef.current })
    }

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
    socket.on('connect', handleReconnect)

    // Cleanup: leave room and remove listener when conversation closes
    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
      socket.off('connect', handleReconnect)
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, interactionId)
    }
  }, [interactionId, socket, queryClient, user?.id])

  // ── 3. Send message (with optimistic update) ───────────────────────────────
  const { mutateAsync: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (content) => sendMessageApi(interactionId, content),

    // Optimistic: show the message immediately before server confirms
    onMutate: async (content) => {
      // Cancel any in-flight refetch that could overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData(queryKey)

      const optimistic = {
        id: `optimistic-${Date.now()}`,
        content,
        senderId: null, // will be filled in by server response
        createdAt: new Date().toISOString(),
        _optimistic: true,
      }

      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev) return { data: [optimistic], pagination: null }
        return { ...prev, data: [...prev.data, optimistic] }
      })

      return { previous }
    },

    // On success: replace the optimistic message with the real one from server
    onSuccess: (savedMessage) => {
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev) return { data: [savedMessage], pagination: null }
        return {
          ...prev,
          data: prev.data.map((m) => (m._optimistic ? savedMessage : m)),
        }
      })
    },

    // On error: roll back to state before the optimistic update
    onError: (_err, _content, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
  })

  // ── 4. Typing indicator helpers ────────────────────────────────────────────
  const emitTypingStart = useCallback(() => {
    if (socket && interactionId) {
      socket.emit(SOCKET_EVENTS.TYPING_START, { interactionId })
    }
  }, [socket, interactionId])

  const emitTypingStop = useCallback(() => {
    if (socket && interactionId) {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { interactionId })
    }
  }, [socket, interactionId])

  return {
    // Message data
    messages,
    pagination,
    isLoading,
    isError,

    // Send
    sendMessage,
    isSending,

    // Typing
    emitTypingStart,
    emitTypingStop,
  }
}

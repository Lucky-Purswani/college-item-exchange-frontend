import { createContext, useContext, useEffect } from 'react'
import { socket } from '@/lib/socket'
import { useAuthStore } from '@/store/auth.store'

/**
 * SOCKET CONTEXT
 *
 * Provides the singleton socket instance to the entire component tree.
 * Manages the socket lifecycle — connects on login, disconnects on logout.
 *
 * Usage:
 *   const socket = useSocket()  // in any component or hook
 */
const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  // 1. Watch the Zustand auth store — react when user logs in or out
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user) {
      // 2. User is authenticated — open the socket connection
      if (!socket.connected) {
        socket.connect()
      }

      // 3. Log connection events in dev for easier debugging
      if (import.meta.env.DEV) {
        const onConnect = () => {
          console.log('🔌 Socket connected:', socket.id)
        }

        const onConnectError = (err) => {
          console.error('❌ Socket connection error:', err.message)
        }

        const onDisconnect = (reason) => {
          console.log('🔌 Socket disconnected:', reason)
        }

        socket.on('connect', onConnect)
        socket.on('connect_error', onConnectError)
        socket.on('disconnect', onDisconnect)

        // Clean up listeners
        return () => {
          socket.off('connect', onConnect)
          socket.off('connect_error', onConnectError)
          socket.off('disconnect', onDisconnect)
        }
      }
    } else {
      // 5. User logged out — close the socket cleanly
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

/**
 * Hook to access the socket instance from any component or hook.
 * Must be used inside <SocketProvider>.
 * @returns {import('socket.io-client').Socket}
 */
export function useSocket() {
  return useContext(SocketContext)
}

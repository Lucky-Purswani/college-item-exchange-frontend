import { io } from 'socket.io-client'

/**
 * Singleton Socket.io client instance.
 *
 * autoConnect: false  — connection is managed by SocketContext based on auth state.
 *                       The socket only connects after the user is verified logged in.
 *
 * withCredentials: true — sends the HttpOnly accessToken cookie on the handshake
 *                         so the backend socket middleware can authenticate the user.
 *
 * transports: websocket first, polling as fallback — efficient for most environments.
 */
export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
})

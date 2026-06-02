/**
 * Socket event name constants — frontend mirror of backend/src/utils/socketEvents.js
 *
 * These MUST match the backend values exactly.
 * If you rename an event, update BOTH files.
 */
export const SOCKET_EVENTS = {
  // Client → Server: room management
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  // Client → Server: typing indicators
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',

  // Server → Client: messages
  NEW_MESSAGE: 'new_message',

  // Server → Client: typing indicators
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',

  // Server → Client: confirmations
  ROOM_JOINED: 'room_joined',

  // Server → Client: errors
  SOCKET_ERROR: 'socket_error',
}

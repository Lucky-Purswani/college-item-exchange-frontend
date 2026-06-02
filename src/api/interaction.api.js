import { api } from './client'

/**
 * INTERACTION API
 * Wraps all conversation and messaging endpoints.
 * All responses follow the backend { success, data, pagination? } shape.
 */

/**
 * Create a new interaction (or return existing) for a listing.
 * Called when a buyer clicks "Contact Seller" on a listing page.
 * @param {string} listingId
 * @returns {Promise<Interaction>}
 */
export const createInteraction = async (listingId) => {
  const res = await api.post('/interactions', { listingId })
  return res.data.data
}

/**
 * Fetch all conversations for the current user (inbox view).
 * Returns enriched conversations sorted by most recent message.
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<{ data: Interaction[], pagination: Pagination }>}
 */
export const getMyInteractions = async (page = 1, limit = 10) => {
  const res = await api.get('/interactions', { params: { page, limit } })
  return res.data.data
}

/**
 * Fetch paginated message history for a specific conversation.
 * Messages are returned oldest-first (standard chat order).
 * @param {string} interactionId
 * @param {number} [page=1]
 * @param {number} [limit=30]
 * @returns {Promise<{ data: Message[], pagination: Pagination }>}
 */
export const getInteractionMessages = async (interactionId, page = 1, limit = 30) => {
  const res = await api.get(`/interactions/${interactionId}/messages`, {
    params: { page, limit },
  })
  return res.data.data
}

/**
 * Send a text message in a conversation.
 * The backend persists the message and emits a real-time socket event.
 * @param {string} interactionId
 * @param {string} content
 * @returns {Promise<Message>}
 */
export const sendMessage = async (interactionId, content) => {
  const res = await api.post(`/interactions/${interactionId}/messages`, { content })
  return res.data.data
}

/**
 * Reset the unread message count for the current user in a conversation.
 * Call this when the user opens a conversation window.
 * @param {string} interactionId
 * @returns {Promise<void>}
 */
export const markAsRead = async (interactionId) => {
  await api.patch(`/interactions/${interactionId}/read`)
}

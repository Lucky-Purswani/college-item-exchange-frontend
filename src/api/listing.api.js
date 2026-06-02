import { api } from './client'

/**
 * Fetch paginated listings with optional filters
 * @param {Object} params - Query parameters for fetching
 * @param {number} params.page - Current page
 * @param {number} params.limit - Items per page
 * @param {string} [params.category] - Category filter
 * @param {string} [params.search] - Search keyword
 * @param {string} [params.sort] - Sort criteria
 */
export const getListings = async (params = {}) => {
  const res = await api.get('/listings', { params })
  return res.data
}

/**
 * Fetch marketplace metrics
 */
export const getMarketplaceStats = async () => {
  const res = await api.get('/listings/stats')
  return res.data
}

/**
 * Fetch listings created by the current user
 */
export const getMyListings = async (params = {}) => {
  const res = await api.get('/listings/me', { params })
  return res.data
}

/**
 * Mark a listing as sold
 */
export const markAsSold = async (id) => {
  const res = await api.patch(`/listings/${id}/sold`)
  return res.data
}

/**
 * Delete a listing
 */
export const deleteListing = async (id) => {
  const res = await api.delete(`/listings/${id}`)
  return res.data
}

/**
 * Fetch a single listing by ID
 */
export const getListingById = async (id) => {
  const res = await api.get(`/listings/${id}`)
  return res.data
}

/**
 * Update a listing by ID (owner only)
 * @param {string} id
 * @param {{ title?: string, description?: string, price?: number, category?: string }} data
 */
export const updateListing = async (id, data) => {
  const res = await api.patch(`/listings/${id}`, data)
  return res.data
}

/**
 * Create a new listing with optional image uploads (multipart/form-data)
 * @param {{ title: string, description: string, price: number, category: string, images?: File[] }} data
 */
export const createListing = async ({ title, description, price, category, images = [] }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('price', price)
  formData.append('category', category)
  images.forEach((file) => formData.append('images', file))

  const res = await api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

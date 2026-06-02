import { api } from './client'

/**
 * Fetch platform statistics
 */
export const getPlatformStats = async () => {
  const res = await api.get('/admin/stats')
  return res.data
}

/**
 * Fetch paginated users
 * @param {Object} params - Query parameters (page, limit, search, role)
 */
export const getAllUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params })
  return res.data
}

/**
 * Ban a user
 * @param {string} id
 */
export const banUser = async (id) => {
  const res = await api.patch(`/admin/users/${id}/ban`)
  return res.data
}

/**
 * Unban a user
 * @param {string} id
 */
export const unbanUser = async (id) => {
  const res = await api.patch(`/admin/users/${id}/unban`)
  return res.data
}

/**
 * Fetch paginated reports
 * @param {Object} params - Query parameters (page, limit, status)
 */
export const getAllReports = async (params = {}) => {
  const res = await api.get('/admin/reports', { params })
  return res.data
}

/**
 * Update report status
 * @param {string} id
 * @param {Object} data - { status: 'RESOLVED' | 'REJECTED', adminNotes?: string }
 */
export const updateReportStatus = async (id, data) => {
  const res = await api.patch(`/admin/reports/${id}`, data)
  return res.data
}

/**
 * Delete a listing as admin
 * @param {string} id
 * @param {string} statusDetail
 */
export const deleteListingAsAdmin = async (id, statusDetail = "ADMIN_REMOVED") => {
  const res = await api.delete(`/admin/listings/${id}`, { data: { statusDetail } })
  return res.data
}

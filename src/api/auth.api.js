import { api } from './client'

/**
 * Login user — backend sets httpOnly cookies, returns { user } or null
 * @param {{ email: string, password: string }} credentials
 */
export const login = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password })
  // Backend returns { success, user } — user may be undefined on some backends
  return res.data?.user ?? null
}

/**
 * Register user — backend sends verification email, no cookies set
 * @param {{ email: string, password: string }} data
 */
export const register = async ({ email, password }) => {
  const res = await api.post('/auth/register', { email, password })
  return res.data
}

/**
 * Logout — backend clears cookies
 */
export const logout = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}

/**
 * Refresh tokens — backend rotates cookies automatically via cookie
 */
export const refreshTokens = async () => {
  const res = await api.post('/auth/refresh')
  return res.data
}

/**
 * Get current user profile
 * @returns {{ id, email, displayName, department, year, status, role, activeListings }}
 */
export const getMe = async () => {
  const res = await api.get('/users/me')
  return res.data?.data ?? null
}

/**
 * Request password reset email
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

/**
 * Reset password using token
 * @param {{ token: string, password: string }} data
 */
export const resetPassword = async ({ token, password }) => {
  const res = await api.post('/auth/reset-password', { token, password })
  return res.data
}

/**
 * Change password for authenticated user
 * @param {{ currentPassword: string, newPassword: string }} data
 */
export const changePassword = async (data) => {
  const res = await api.patch('/auth/change-password', data)
  return res.data
}

/**
 * Verify email using the token from the verification email link
 * @param {string} token
 */
export const verifyEmail = async (token) => {
  const res = await api.post(`/auth/verify-email?token=${token}`)
  return res.data
}

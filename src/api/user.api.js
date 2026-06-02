import { api } from './client'

/**
 * Update the authenticated user's profile
 * @param {{ displayName: string }} data
 */
export const updateProfile = async (data) => {
  const res = await api.patch('/users/me', data)
  return res.data
}

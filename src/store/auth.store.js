import { create } from 'zustand'

/**
 * Auth Zustand store
 * Stores only the user object — NO tokens
 */
export const useAuthStore = create((set) => ({
  /** @type {object|null} */
  user: null,

  /** @param {object} user */
  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}))

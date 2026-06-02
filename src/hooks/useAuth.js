import { useAuthStore } from '@/store/auth.store'

/**
 * Synchronously reads auth state from Zustand.
 * No network calls — instant reads.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)

  return {
    user,
    isAuthenticated: !!user,
    setUser,
    clearUser,
  }
}

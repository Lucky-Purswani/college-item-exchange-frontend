import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getMe } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

/**
 * Fetches and caches the current user from the server.
 * Syncs result into Zustand store.
 * staleTime: 5 min — no refetch on every route change
 * gcTime: 10 min — stays cached after unmount
 */
export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // If the browser flag says we are logged out, instantly return null without hitting the API
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        return null
      }
      const user = await getMe()
      return user
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Safely sync data to Zustand after render
  useEffect(() => {
    if (query.isFetched) {
      if (query.data) {
        setUser(query.data)
      } else {
        clearUser()
      }
    }
  }, [query.data, query.isFetched, setUser, clearUser])

  return query
}

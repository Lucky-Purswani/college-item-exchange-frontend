import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '@/api/user.api'
import { changePassword } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate currentUser query so the UI (navbar, profile) fetches the new display name
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}

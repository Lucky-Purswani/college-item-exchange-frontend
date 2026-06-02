import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyInteractions, createInteraction } from '@/api/interaction.api'

/**
 * Fetch the current user's conversation inbox.
 *
 * staleTime: 0 — always refetch, as unread counts change on every new message.
 * The backend caches this at 30s so repeated rapid fetches are still efficient.
 */
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => getMyInteractions(),
    staleTime: 0,
  })
}

/**
 * Create or retrieve an existing interaction for a listing.
 * Used by "Contact Seller" buttons on listing pages.
 *
 * On success: invalidates the conversations list so the new conversation
 * appears in the inbox immediately.
 *
 * @returns {UseMutationResult} — call mutateAsync(listingId) to trigger
 */
export function useCreateInteraction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId) => createInteraction(listingId),
    onSuccess: () => {
      // Refresh inbox so new conversation is visible
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

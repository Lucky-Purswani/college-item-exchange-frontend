import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getListings, getMarketplaceStats, getMyListings, markAsSold, deleteListing, getListingById, updateListing, createListing } from '@/api/listing.api'

/**
 * Custom hook to fetch listings with infinite scroll support
 * @param {Object} filters
 * @param {string} filters.search
 * @param {string} filters.category
 * @param {string} filters.sort
 */
export function useListings(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['listings', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getListings({
        ...filters,
        page: pageParam,
        limit: 15,
      })
      return response
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined
      
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch marketplace metrics
 */
export function useMarketplaceStats() {
  return useQuery({
    queryKey: ['listings', 'stats'],
    queryFn: getMarketplaceStats,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Custom hook to fetch current user's listings with infinite scroll
 */
export function useMyListings() {
  return useInfiniteQuery({
    queryKey: ['myListings'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getMyListings({
        page: pageParam,
        limit: 15,
      })
      return response
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined
      
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Mutation to mark a listing as sold
 */
export function useMarkAsSold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => markAsSold(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

/**
 * Mutation to delete a listing
 */
export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

/**
 * Fetch a single listing by ID
 */
export function useListing(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Mutation to update a listing (owner only)
 */
export function useUpdateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateListing(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] })
      queryClient.invalidateQueries({ queryKey: ['myListings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

/**
 * Mutation to create a new listing (multipart/form-data)
 */
export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] }) // activeListings count
    },
  })
}

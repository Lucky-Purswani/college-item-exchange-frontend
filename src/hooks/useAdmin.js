import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import * as adminApi from '@/api/admin.api'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getPlatformStats,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useAdminUsers(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await adminApi.getAllUsers({
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
  })
}

export function useAdminReports(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['admin', 'reports', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await adminApi.getAllReports({
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
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminApi.banUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useUnbanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminApi.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, adminNotes }) => adminApi.updateReportStatus(id, { status, adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useAdminDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminApi.deleteListingAsAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

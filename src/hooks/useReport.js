import { useMutation } from '@tanstack/react-query'
import { createReport } from '@/api/report.api'

export function useCreateReport() {
  return useMutation({
    mutationFn: createReport,
  })
}

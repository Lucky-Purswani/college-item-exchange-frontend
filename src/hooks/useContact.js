import { useMutation } from '@tanstack/react-query'
import { sendMessageToSeller } from '@/api/contact.api'

export function useContactSeller() {
  return useMutation({
    mutationFn: sendMessageToSeller,
  })
}

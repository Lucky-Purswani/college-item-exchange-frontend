import { api } from './client'

export const sendMessageToSeller = async (data) => {
  const res = await api.post('/contact/message', data)
  return res.data
}

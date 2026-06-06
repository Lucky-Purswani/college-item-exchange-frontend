import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.PROD ? '/backend' : import.meta.env.VITE_API_URL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    // Do not intercept if it's the refresh route itself to prevent recursive loops
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(original)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        isRefreshing = false
        processQueue(null)
        return api(original)
      } catch (err) {
        processQueue(err, null)
        isRefreshing = false
        useAuthStore.getState().clearUser()
        localStorage.removeItem('isLoggedIn')
        
        // Prevent infinite reload loop if already on an unauthenticated page
        const publicRoutes = ['/login', '/register', '/', '/forgot-password', '/reset-password']
        if (!publicRoutes.includes(window.location.pathname)) {
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

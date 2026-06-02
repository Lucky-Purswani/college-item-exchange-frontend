import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/lib/queryClient'
import { ErrorPage } from '@/routes/error'
import { SocketProvider } from '@/contexts/SocketContext'
import './index.css'

const router = createRouter({
  routeTree,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* SocketProvider connects/disconnects the socket based on auth state */}
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </QueryClientProvider>
  </StrictMode>
)

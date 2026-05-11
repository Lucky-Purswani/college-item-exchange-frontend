import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const { data: currentUser, isError } = useCurrentUser()

  // Ensure user exists and has ADMIN role
  if (isError || !currentUser || currentUser.role !== 'ADMIN') {
    // If not admin, send them to home
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { data: user, isError } = useCurrentUser()

  // If query errored or returned null/undefined, user is not authenticated
  if (isError || !user) {
    window.location.href = '/login'
    return null
  }

  return <Outlet />
}

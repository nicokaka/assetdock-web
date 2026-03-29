import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useSessionQuery } from '@/features/auth/hooks/use-session'

function SessionLoadingState() {
  return (
    <div className="py-10 text-sm text-muted-foreground">
      Loading session...
    </div>
  )
}

export function RequireSession({ children }: PropsWithChildren) {
  const sessionQuery = useSessionQuery()

  if (sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (!sessionQuery.data) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function RedirectIfAuthenticated({ children }: PropsWithChildren) {
  const sessionQuery = useSessionQuery()

  if (sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (sessionQuery.data) {
    return <Navigate to="/app" replace />
  }

  return children
}

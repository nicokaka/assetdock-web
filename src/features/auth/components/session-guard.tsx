import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { useSetupStatus } from '@/features/setup/hooks/use-setup-status'

function SessionLoadingState() {
  return (
    <div className="py-10 text-sm text-muted-foreground">
      Loading session...
    </div>
  )
}

export function RequireSession({ children }: PropsWithChildren) {
  // Check setup status BEFORE checking session.
  // If the system is not configured, there are no users to authenticate.
  const setupQuery = useSetupStatus()
  const sessionQuery = useSessionQuery()

  if (setupQuery.isPending || sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (setupQuery.data && !setupQuery.data.configured) {
    return <Navigate to="/setup" replace />
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

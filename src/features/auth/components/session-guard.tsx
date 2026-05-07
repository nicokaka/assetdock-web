import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { useSetupStatus } from '@/features/setup/hooks/use-setup-status'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

function SessionLoadingState({ isError }: { isError?: boolean }) {
  const { t } = useTranslation()
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="py-10 text-sm text-muted-foreground flex flex-col items-center justify-center min-h-[50vh]">
      {isError || showTimeout ? (
        <span className="text-destructive">
          {isError ? 'Connection error.' : 'Connection is taking too long.'} Please check your network and refresh.
        </span>
      ) : (
        <span>{t('auth.loadingSession', 'Loading session...')}</span>
      )}
    </div>
  )
}

export function RequireSession({ children }: PropsWithChildren) {
  // Check setup status BEFORE checking session.
  // If the system is not configured, there are no users to authenticate.
  const setupQuery = useSetupStatus()
  const isConfigured = setupQuery.data?.configured === true

  // Only trigger the session fetch if the system is configured.
  const sessionQuery = useSessionQuery({ enabled: isConfigured })

  if (setupQuery.isPending) {
    return <SessionLoadingState />
  }

  if (setupQuery.isError) {
    return <SessionLoadingState isError={true} />
  }

  if (setupQuery.data && !setupQuery.data.configured) {
    return <Navigate to="/setup" replace />
  }

  if (sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (sessionQuery.isError && !sessionQuery.data) {
    // If it's a 401/403, data is null, so it will fall through to Navigate /login
    // If it's a network error or 500, we should show the error state
    const err = sessionQuery.error as { status?: number }
    if (err?.status !== 401 && err?.status !== 403) {
       return <SessionLoadingState isError={true} />
    }
  }

  if (!sessionQuery.data) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function RedirectIfAuthenticated({ children }: PropsWithChildren) {
  const setupQuery = useSetupStatus()
  const isConfigured = setupQuery.data?.configured === true

  const sessionQuery = useSessionQuery({ enabled: isConfigured })

  if (setupQuery.isPending) {
    return <SessionLoadingState />
  }

  if (setupQuery.isError) {
    return <SessionLoadingState isError={true} />
  }

  if (setupQuery.data && !setupQuery.data.configured) {
    return <Navigate to="/setup" replace />
  }

  if (sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (sessionQuery.isError) {
    const err = sessionQuery.error as { status?: number }
    if (err?.status !== 401 && err?.status !== 403) {
      return <SessionLoadingState isError={true} />
    }
  }

  if (sessionQuery.data) {
    return <Navigate to="/app" replace />
  }

  return children
}

export function RedirectIfConfigured({ children }: PropsWithChildren) {
  const setupQuery = useSetupStatus()

  if (setupQuery.isPending) {
    return <SessionLoadingState />
  }

  if (setupQuery.isError) {
    return <SessionLoadingState isError={true} />
  }

  if (setupQuery.data?.configured) {
    return <Navigate to="/login" replace />
  }

  return children
}

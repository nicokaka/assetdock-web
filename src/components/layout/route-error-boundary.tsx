import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function RouteErrorBoundary() {
  const error = useRouteError()
  // L-11: Wrap strings in t() for i18n consistency.
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {t('errors.boundary.title', 'Something went wrong')}
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          {t('errors.boundary.description', 'An unexpected error occurred while trying to render this page.')}
        </p>
        <p className="text-sm font-mono text-destructive">
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : 'Unknown error'}
        </p>
        <div className="pt-4">
          <Button onClick={() => window.location.assign('/')}>
            {t('errors.boundary.action', 'Return to Home')}
          </Button>
        </div>
      </div>
    </div>
  )
}

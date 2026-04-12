import { useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function RouteErrorBoundary() {
  const error = useRouteError()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Something went wrong</h1>
        <p className="max-w-md text-base text-muted-foreground">
          An unexpected error occurred while trying to render this page.
        </p>
        <p className="text-sm font-mono text-destructive">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <div className="pt-4">
          <Button onClick={() => window.location.assign('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

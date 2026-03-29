import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSessionQuery } from '@/features/auth/hooks/use-session'

export function AppOverviewPage() {
  const sessionQuery = useSessionQuery()

  return (
    <section className="max-w-3xl">
      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Overview
          </CardTitle>
          <CardDescription>
            Use the main areas to review assets, users, imports, and audit activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {sessionQuery.data?.user.fullName}
            </p>
            <p>{sessionQuery.data?.user.email}</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Start with assets for inventory work, users for access administration,
            or audit logs for a quick operational trace.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/assets">Open assets</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/users">Open users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/audit-logs">Open audit logs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

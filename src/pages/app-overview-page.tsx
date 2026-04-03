import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSessionQuery } from '@/features/auth/hooks/use-session'

export function AppOverviewPage() {
  const sessionQuery = useSessionQuery()

  return (
    <section className="max-w-3xl">
      <div className="space-y-6">
        <PageHeader
          title="Overview"
          description="Use the main areas to review assets, users, imports, and audit activity."
        />

        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Current session
            </CardTitle>
            <CardDescription>
              Start from the areas most relevant to the task you are handling now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {sessionQuery.data?.user.fullName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sessionQuery.data?.user.email}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
                Keep the session active while moving between inventory, users, imports,
                and audit review.
              </div>
            </div>
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
      </div>
    </section>
  )
}

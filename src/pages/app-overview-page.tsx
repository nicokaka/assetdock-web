import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { useUsersListQuery } from '@/features/users/hooks/use-users'

function StatCard({ label, value, to }: { label: string; value: string | number; to: string }) {
  return (
    <Link to={to} className="group">
      <Card className="border-border/80 bg-card/78 shadow-sm transition-all hover:border-border hover:shadow-md">
        <CardContent className="px-5 py-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {value}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AppOverviewPage() {
  const sessionQuery = useSessionQuery()
  const assetsQuery = useAssetsQuery()
  const usersQuery = useUsersListQuery()

  const assetCount = assetsQuery.data?.length ?? '—'
  const userCount = usersQuery.data?.length ?? '—'

  return (
    <section className="space-y-6">
      <PageHeader
        title="Overview"
        description="Use the main areas to review assets, users, imports, and audit activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total assets" value={assetCount} to="/app/assets" />
        <StatCard label="Total users" value={userCount} to="/app/users" />
        <Link to="/app/imports" className="group">
          <Card className="border-border/80 bg-card/78 shadow-sm transition-all hover:border-border hover:shadow-md">
            <CardContent className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Imports</p>
              <p className="mt-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                Upload CSV
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/audit-logs" className="group">
          <Card className="border-border/80 bg-card/78 shadow-sm transition-all hover:border-border hover:shadow-md">
            <CardContent className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Audit logs</p>
              <p className="mt-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                View activity
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-border/80 bg-card/78 shadow-sm">
        <CardContent className="px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {sessionQuery.data?.user.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {sessionQuery.data?.user.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/app/assets">Open assets</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/users">Open users</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/audit-logs">Open audit logs</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

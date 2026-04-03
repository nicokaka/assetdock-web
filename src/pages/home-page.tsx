import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,28rem)] lg:items-center">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            Asset inventory and access operations
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AssetDock Web
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            A sober browser interface for assets, users, imports, and audit activity,
            built to work directly with the AssetDock API.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/login">Open the app</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app">View authenticated area</Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/80 bg-card/88 shadow-md backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Current MVP areas
          </CardTitle>
          <CardDescription className="leading-6">
            The app already covers the main operational flows without adding visual noise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            Assets, lifecycle actions, and assignments
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            Users, roles, and status updates
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            Audit logs and CSV imports
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

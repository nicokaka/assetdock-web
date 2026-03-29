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
            The authenticated area is ready for the first operational screens.
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
            Start with the assets area to inspect the first list-based view of the
            product.
          </p>
          <Button asChild variant="outline">
            <Link to="/app/assets">Open assets</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

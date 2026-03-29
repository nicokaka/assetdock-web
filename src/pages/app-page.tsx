import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogoutMutation, useSessionQuery } from '@/features/auth/hooks/use-session'

export function AppPage() {
  const sessionQuery = useSessionQuery()
  const logoutMutation = useLogoutMutation()

  const fullName = sessionQuery.data?.user.fullName ?? 'Authenticated user'
  const email = sessionQuery.data?.user.email ?? ''

  return (
    <section className="max-w-2xl">
      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            App area
          </CardTitle>
          <CardDescription>
            Protected placeholder for authenticated routes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{fullName}</p>
            {email ? <p>{email}</p> : null}
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

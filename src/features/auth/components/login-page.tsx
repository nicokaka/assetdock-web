import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-tight text-muted-foreground">
          Browser session sign-in
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sign in
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Use your AssetDock credentials to access the authenticated workspace for
            assets, users, imports, and audit activity.
          </p>
        </div>
      </div>

      <Card className="w-full border-border/80 bg-card/92 shadow-md backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Access the app
          </CardTitle>
          <CardDescription className="leading-6">
            The current session stays in the browser through the backend web auth flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  )
}

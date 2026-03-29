import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Access the AssetDock web application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  )
}

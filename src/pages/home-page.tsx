import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  return (
    <section className="max-w-2xl">
      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            AssetDock Web
          </CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6">
            Frontend foundation for the AssetDock platform, prepared for incremental
            integration with the security-first backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            This frontend is intentionally minimal at this stage. Routing,
            shared providers, UI primitives, and local development foundations
            are in place for the next steps.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

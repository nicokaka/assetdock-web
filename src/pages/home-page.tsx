import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
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
            Frontend foundation for the AssetDock platform, prepared for gradual
            integration with the API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            The app is intentionally small at this stage. Routing, shared
            providers, and the first authentication-facing screen are ready for
            the next iteration.
          </p>
          <Button asChild variant="outline">
            <Link to="/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

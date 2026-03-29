import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetCreateForm } from '@/features/assets/components/asset-create-form'

export function AssetCreatePage() {
  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to="/app/assets">Back to assets</Link>
        </Button>
      </div>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            New Asset
          </CardTitle>
          <CardDescription>
            Create a new asset with the core fields needed for this first step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetCreateForm />
        </CardContent>
      </Card>
    </section>
  )
}

import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetDetailView } from '@/features/assets/components/asset-detail-view'
import { useAssetDetailQuery } from '@/features/assets/hooks/use-asset-detail'
import { HttpError } from '@/lib/http-client'

export function AssetDetailPage() {
  const { assetId = '' } = useParams()
  const assetQuery = useAssetDetailQuery(assetId)

  const isNotFound =
    assetQuery.isError &&
    assetQuery.error instanceof HttpError &&
    assetQuery.error.status === 404

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to="/app/assets">Back to assets</Link>
        </Button>
      </div>

      {assetQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading asset...
          </CardContent>
        </Card>
      ) : null}

      {isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Asset not found</CardTitle>
            <CardDescription>
              The requested asset could not be loaded for the current session.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isError && !isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Unable to load asset
            </CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isSuccess ? <AssetDetailView key={assetQuery.data.id} asset={assetQuery.data} /> : null}
    </section>
  )
}

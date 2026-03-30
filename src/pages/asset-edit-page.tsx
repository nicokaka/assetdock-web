import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AssetForm,
} from '@/features/assets/components/asset-form'
import {
  type AssetFormValues,
  toAssetInput,
} from '@/features/assets/types/asset-form'
import { useAssetDetailQuery } from '@/features/assets/hooks/use-asset-detail'
import { useUpdateAssetMutation } from '@/features/assets/hooks/use-update-asset'
import { HttpError } from '@/lib/http-client'

function toDefaultValues(asset: NonNullable<ReturnType<typeof useAssetDetailQuery>['data']>): AssetFormValues {
  return {
    assetTag: asset.assetTag,
    displayName: asset.displayName ?? '',
    serialNumber: asset.serialNumber ?? '',
    hostname: asset.hostname ?? '',
    description: asset.description ?? '',
    categoryId: asset.categoryId ?? '',
    manufacturerId: asset.manufacturerId ?? '',
    currentLocationId: asset.currentLocationId ?? '',
  }
}

export function AssetEditPage() {
  const navigate = useNavigate()
  const { assetId = '' } = useParams()
  const assetQuery = useAssetDetailQuery(assetId)
  const updateAssetMutation = useUpdateAssetMutation(assetId)

  async function handleSubmit(values: AssetFormValues) {
    const asset = await updateAssetMutation.mutateAsync(toAssetInput(values))
    navigate(`/app/assets/${asset.id}`, { replace: true })
  }

  const errorMessage =
    updateAssetMutation.error instanceof HttpError && updateAssetMutation.error.status === 400
      ? 'Unable to save the asset with the provided data.'
      : updateAssetMutation.isError
        ? 'Unable to save the asset right now.'
        : undefined

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to={`/app/assets/${assetId}`}>Back to asset</Link>
        </Button>
      </div>

      {assetQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading asset...
          </CardContent>
        </Card>
      ) : null}

      {assetQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unable to load asset</CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isSuccess ? (
        <Card className="max-w-2xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Edit Asset
            </CardTitle>
            <CardDescription>
              Update the core asset fields currently supported in the frontend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssetForm
              defaultValues={toDefaultValues(assetQuery.data)}
              submitLabel="Save changes"
              pendingLabel="Saving..."
              isPending={updateAssetMutation.isPending}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

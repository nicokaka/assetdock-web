import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AssetForm,
} from '@/features/assets/components/asset-form'
import type { AssetFormValues } from '@/features/assets/types/asset-form'
import { toAssetInput } from '@/features/assets/types/asset-form'
import { useCreateAssetMutation } from '@/features/assets/hooks/use-create-asset'
import { HttpError } from '@/lib/http-client'

export function AssetCreatePage() {
  const navigate = useNavigate()
  const createAssetMutation = useCreateAssetMutation()

  async function handleSubmit(values: AssetFormValues) {
    const asset = await createAssetMutation.mutateAsync(toAssetInput(values))
    navigate(`/app/assets/${asset.id}`, { replace: true })
  }

  const errorMessage =
    createAssetMutation.error instanceof HttpError && createAssetMutation.error.status === 400
      ? 'Unable to create the asset with the provided data.'
      : createAssetMutation.isError
        ? 'Unable to create the asset right now.'
        : undefined

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
          <AssetForm
            defaultValues={{
              assetTag: '',
              displayName: '',
              serialNumber: '',
              hostname: '',
              description: '',
              categoryId: '',
              manufacturerId: '',
              currentLocationId: '',
            }}
            submitLabel="Create asset"
            pendingLabel="Creating..."
            isPending={createAssetMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </section>
  )
}

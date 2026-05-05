import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
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
  const { t } = useTranslation()
  const createAssetMutation = useCreateAssetMutation()

  async function handleSubmit(values: AssetFormValues) {
    const asset = await createAssetMutation.mutateAsync(toAssetInput(values))
    navigate(`/app/assets/${asset.id}`, { replace: true })
  }

  const errorMessage =
    createAssetMutation.error instanceof HttpError && createAssetMutation.error.status === 400
      ? t('assetForm.errorNew', 'Unable to create the asset with the provided data.')
      : createAssetMutation.isError
        ? t('assetForm.errorGeneric', 'Unable to process the request right now.')
        : undefined

  return (
    <section className="space-y-6">
      <div>
        <button onClick={() => navigate('/app/assets')} className={buttonVariants({ variant: 'outline' })}>
          {t('assetForm.back', 'Back to assets')}
        </button>
      </div>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('assetForm.titleNew', 'New Asset')}
          </CardTitle>
          <CardDescription>
            {t('assetForm.descriptionNew', 'Create a new asset with the core fields currently supported in the app.')}
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
            submitLabel={t('assetForm.submitNew', 'Create asset')}
            pendingLabel={t('assetForm.submittingNew', 'Creating...')}
            isPending={createAssetMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </section>
  )
}

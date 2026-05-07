import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
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
import { usePageTitle } from '@/hooks/use-page-title'

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
  usePageTitle(useTranslation().t('assetForm.titleEdit', 'Edit Asset'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { assetId = '' } = useParams()
  const assetQuery = useAssetDetailQuery(assetId)
  const updateAssetMutation = useUpdateAssetMutation(assetId)

  const assetLabel = assetQuery.data?.displayName || assetQuery.data?.assetTag || t('breadcrumb.asset', 'Asset')

  async function handleSubmit(values: AssetFormValues) {
    const asset = await updateAssetMutation.mutateAsync(toAssetInput(values))
    navigate(`/app/assets/${asset.id}`, { replace: true })
  }

  const errorMessage =
    updateAssetMutation.error instanceof HttpError && updateAssetMutation.error.status === 400
      ? t('assetForm.errorEdit', 'Unable to save the asset with the provided data.')
      : updateAssetMutation.isError
        ? t('assetForm.errorGeneric', 'Unable to save the asset right now.')
        : undefined

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.assets', 'Assets'), href: '/app/assets' },
            { label: assetLabel, href: `/app/assets/${assetId}` },
            { label: t('assetForm.titleEdit', 'Edit') },
          ]}
        />
        <button onClick={() => navigate(`/app/assets/${assetId}`)} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {t('assetForm.back', 'Back to asset')}
        </button>
      </div>

      {assetQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('details.loading', 'Loading...')}
          </CardContent>
        </Card>
      ) : null}

      {assetQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.assets.errorTitle', 'Unable to load asset')}</CardTitle>
            <CardDescription>
              {t('app.users.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isSuccess ? (
        <Card className="max-w-2xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {t('assetForm.titleEdit', 'Edit Asset')}
            </CardTitle>
            <CardDescription>
              {t('assetForm.descriptionEdit', 'Update the asset information and lifecycle data.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssetForm
              defaultValues={toDefaultValues(assetQuery.data)}
              submitLabel={t('assetForm.submitEdit', 'Save changes')}
              pendingLabel={t('assetForm.submittingEdit', 'Saving...')}
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

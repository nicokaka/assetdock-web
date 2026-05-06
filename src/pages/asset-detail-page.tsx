import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetDetailView } from '@/features/assets/components/asset-detail-view'
import { useAssetDetailQuery } from '@/features/assets/hooks/use-asset-detail'
import { HttpError } from '@/lib/http-client'

export function AssetDetailPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { assetId = '' } = useParams()
  const assetQuery = useAssetDetailQuery(assetId)

  const assetLabel = assetQuery.data?.displayName || assetQuery.data?.assetTag || t('breadcrumb.asset', 'Asset')

  const isNotFound =
    assetQuery.isError &&
    assetQuery.error instanceof HttpError &&
    assetQuery.error.status === 404

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.assets', 'Assets'), href: '/app/assets' },
            { label: assetLabel },
          ]}
        />
        <button onClick={() => navigate('/app/assets')} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {t('assetForm.back', 'Back to assets')}
        </button>
      </div>

      {assetQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('details.loading', 'Loading...')}
          </CardContent>
        </Card>
      ) : null}

      {isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('details.asset.notFound', 'Asset not found')}</CardTitle>
            <CardDescription>
              {t('app.assets.errorTitle', 'The requested asset could not be loaded for the current session.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isError && !isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t('app.assets.errorTitle', 'Unable to load asset')}
            </CardTitle>
            <CardDescription>
              {t('app.users.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetQuery.isSuccess ? <AssetDetailView key={assetQuery.data.id} asset={assetQuery.data} /> : null}
    </section>
  )
}

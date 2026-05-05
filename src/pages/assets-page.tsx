import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetsList } from '@/features/assets/components/assets-list'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assetStatusLabels } from '@/features/assets/constants/labels'

export function AssetsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const { t } = useTranslation()

  const assetsQuery = useAssetsQuery({
    page,
    size: 20,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('app.assets.title', 'Assets')}
        description={t('app.assets.description', 'Review the assets available to the current session.')}
        action={
          <Button variant="outline" onClick={() => navigate('/app/assets/new')}>
            {t('app.assets.newAsset', 'New Asset')}
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          placeholder={t('app.assets.searchPlaceholder', 'Search by tag, name or serial...')}
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('app.assets.allStatuses', 'All Statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.assets.allStatuses', 'All Statuses')}</SelectItem>
            {Object.entries(assetStatusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {t(`app.overview.status.${key}`, label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {assetsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : null}

      {assetsQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('app.assets.errorTitle', 'Unable to load assets right now.')}
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.assets.emptyTitle', 'No assets found')}</CardTitle>
            <CardDescription>
              {search || status !== 'all' 
                ? t('app.assets.emptyDescriptionFilters', 'Try adjusting your filters.') 
                : t('app.assets.emptyDescriptionStart', 'Create the first asset to start working with the inventory area.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/app/assets/new')}>
              {t('app.assets.newAsset', 'New Asset')}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <AssetsList assets={assetsQuery.data.items} />
          <PaginationControls
            page={assetsQuery.data.page}
            totalPages={assetsQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </section>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Download } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetsList } from '@/features/assets/components/assets-list'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { useCategoriesQuery, useLocationsQuery } from '@/features/catalog/hooks/use-catalog-lookups'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assetStatusLabels } from '@/features/assets/constants/labels'
import { useDebounce } from '@/hooks/use-debounce'
import { usePageTitle } from '@/hooks/use-page-title'
import { httpClient, HttpError } from '@/lib/http-client'
import { toast } from 'sonner'

export function AssetsPage() {
  usePageTitle(useTranslation().t('app.header.assets', 'Assets'))
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useState(() => {
    const p = searchParams.get('page')
    return p ? parseInt(p, 10) : 1
  })
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '')
  const [status, setStatus] = useState(() => searchParams.get('status') ?? 'all')
  const [categoryId, setCategoryId] = useState(() => searchParams.get('categoryId') ?? 'all')
  const [locationId, setLocationId] = useState(() => searchParams.get('locationId') ?? 'all')
  const debouncedSearch = useDebounce(search, 400)

  // Sync state with URL when browser navigation occurs (back/forward or external link)
  useEffect(() => {
    const p = searchParams.get('page')
    setPage(p ? parseInt(p, 10) : 1)
    setSearch(searchParams.get('search') ?? '')
    setStatus(searchParams.get('status') ?? 'all')
    setCategoryId(searchParams.get('categoryId') ?? 'all')
    setLocationId(searchParams.get('locationId') ?? 'all')
  }, [searchParams])

  // Helper to update searchParams
  const updateUrlParam = useCallback((key: string, value: string, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === 'all' || !value) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      if (resetPage) {
        next.set('page', '1')
      }
      return next
    })
  }, [setSearchParams])

  // Update URL search parameter when debounced search changes
  useEffect(() => {
    // Only update if search has actually debounced to a different value than the URL param
    const currentUrlSearch = searchParams.get('search') ?? ''
    if (debouncedSearch !== currentUrlSearch) {
      updateUrlParam('search', debouncedSearch, true)
    }
  }, [debouncedSearch, searchParams, updateUrlParam])

  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  async function handleExportCsv() {
    setIsExporting(true)
    try {
      const blob = await httpClient.request<Blob>('/assets/export', {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `assets-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success(t('app.assets.exportSuccess', 'CSV exported successfully.'))
    } catch (error) {
      const message =
        error instanceof HttpError
          ? error.message
          : t('app.assets.exportError', 'Failed to export CSV. Please try again.')
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  const categoriesQuery = useCategoriesQuery()
  const locationsQuery = useLocationsQuery()

  const assetsQuery = useAssetsQuery({
    page,
    size: 20,
    search: debouncedSearch || undefined,
    status: status !== 'all' ? status : undefined,
    categoryId: categoryId !== 'all' ? categoryId : undefined,
    locationId: locationId !== 'all' ? locationId : undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title={assetsQuery.data ? `${t('app.assets.title', 'Assets')} (${assetsQuery.data.totalItems})` : t('app.assets.title', 'Assets')}
        description={t('app.assets.description', 'Review the assets available to the current session.')}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={isExporting}
              onClick={() => void handleExportCsv()}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {isExporting ? t('app.assets.exporting', 'Exporting...') : t('app.assets.exportCsv', 'Export CSV')}
            </Button>
            <Button variant="default" onClick={() => navigate('/app/assets/new')}>
              {t('app.assets.newAsset', 'New Asset')}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
          }}
          placeholder={t('app.assets.searchPlaceholder', 'Search by tag, name or serial...')}
        />
        <Select
          value={status}
          onValueChange={(val) => {
            updateUrlParam('status', val)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
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

        <Select
          value={categoryId}
          onValueChange={(val) => {
            updateUrlParam('categoryId', val)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t('app.assets.allCategories', 'All Categories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.assets.allCategories', 'All Categories')}</SelectItem>
            {categoriesQuery.data?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={locationId}
          onValueChange={(val) => {
            updateUrlParam('locationId', val)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t('app.assets.allLocations', 'All Locations')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.assets.allLocations', 'All Locations')}</SelectItem>
            {locationsQuery.data?.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
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
              {search || status !== 'all' || categoryId !== 'all' || locationId !== 'all'
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
            onPageChange={(newPage) => updateUrlParam('page', String(newPage), false)}
          />
        </div>
      ) : null}
    </section>
  )
}

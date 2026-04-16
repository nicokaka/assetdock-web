import { useState } from 'react'
import { Link } from 'react-router-dom'

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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')

  const assetsQuery = useAssetsQuery({
    page,
    size: 20,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title="Assets"
        description="Review the assets available to the current session."
        action={
          <Button asChild variant="outline">
          <Link to="/app/assets/new">New Asset</Link>
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
          placeholder="Search by tag, name or serial..."
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(assetStatusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
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
            Unable to load assets right now.
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">No assets found</CardTitle>
            <CardDescription>
              {search || status !== 'all' 
                ? 'Try adjusting your filters.' 
                : 'Create the first asset to start working with the inventory area.'}
            </CardDescription>
          </CardHeader>
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

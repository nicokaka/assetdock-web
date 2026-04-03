import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import type { AssetListItem } from '@/features/assets/types/asset'
import { cn } from '@/lib/utils'

type AssetsListProps = {
  assets: AssetListItem[]
}

function formatAssetName(asset: AssetListItem) {
  return asset.displayName || asset.assetTag
}

const statusLabels: Record<AssetListItem['status'], string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  IN_STOCK: 'In Stock',
  IN_MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  LOST: 'Lost',
}

function formatStatusLabel(status: AssetListItem['status']) {
  return statusLabels[status] ?? status
}

function statusClassName(status: AssetListItem['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'IN_STOCK':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'INACTIVE':
      return 'border-slate-200 bg-slate-100 text-slate-700'
    case 'IN_MAINTENANCE':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'RETIRED':
      return 'border-zinc-200 bg-zinc-100 text-zinc-700'
    case 'LOST':
      return 'border-rose-200 bg-rose-50 text-rose-700'
  }
}

export function AssetsList({ assets }: AssetsListProps) {
  return (
    <div className="space-y-2.5">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className="border-border/80 bg-card/78 py-0 shadow-sm hover:border-border hover:shadow-md"
        >
          <CardContent className="px-0">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
                      statusClassName(asset.status)
                    )}
                  >
                    {formatStatusLabel(asset.status)}
                  </span>
                  <span className="rounded-md border border-border/80 bg-background/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                    {asset.assetTag}
                  </span>
                  {asset.archivedAt ? (
                    <span className="rounded-full border border-border/70 bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      Archived
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <div className="text-base font-medium text-foreground">
                    <Link
                      to={`/app/assets/${asset.id}`}
                      className="transition-colors duration-200 hover:text-primary"
                    >
                      {formatAssetName(asset)}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {asset.serialNumber ? (
                      <span>Serial {asset.serialNumber}</span>
                    ) : (
                      <span>No serial number</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center">
                <Link
                  to={`/app/assets/${asset.id}`}
                  className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  View details
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

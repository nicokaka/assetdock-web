import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AssetListItem } from '@/features/assets/types/asset'

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

function statusVariant(status: AssetListItem['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'success' as const
    case 'IN_STOCK':
      return 'info' as const
    case 'INACTIVE':
      return 'muted' as const
    case 'IN_MAINTENANCE':
      return 'warning' as const
    case 'RETIRED':
      return 'muted' as const
    case 'LOST':
      return 'danger' as const
  }
}

export function AssetsList({ assets }: AssetsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Serial</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(asset.status)}>
                  {statusLabels[asset.status] ?? asset.status}
                </Badge>
                {asset.archivedAt ? (
                  <Badge variant="muted">Archived</Badge>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              <span className="rounded-md border border-border/80 bg-background/80 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {asset.assetTag}
              </span>
            </TableCell>
            <TableCell>
              <Link
                to={`/app/assets/${asset.id}`}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {formatAssetName(asset)}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {asset.serialNumber || '—'}
            </TableCell>
            <TableCell className="text-right">
              <Link
                to={`/app/assets/${asset.id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

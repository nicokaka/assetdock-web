import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
import { assetStatusLabels, assetStatusVariant } from '@/features/assets/constants/labels'

type AssetsListProps = {
  assets: AssetListItem[]
}

function formatAssetName(asset: AssetListItem) {
  return asset.displayName || asset.assetTag
}



export function AssetsList({ assets }: AssetsListProps) {
  const { t } = useTranslation()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('app.assets.table.status', 'Status')}</TableHead>
          <TableHead>{t('app.assets.table.tag', 'Tag')}</TableHead>
          <TableHead>{t('app.assets.table.name', 'Name')}</TableHead>
          <TableHead>{t('app.assets.table.serial', 'Serial')}</TableHead>
          <TableHead>{t('app.assets.table.assignedTo', 'Assigned To')}</TableHead>
          <TableHead className="text-right">{t('app.assets.table.actions', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant={assetStatusVariant(asset.status)}>
                  {t(`app.overview.status.${asset.status}`, assetStatusLabels[asset.status] ?? asset.status)}
                </Badge>
                {asset.archivedAt ? (
                  <Badge variant="muted">{t('details.badges.archived', 'Archived')}</Badge>
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
            <TableCell className="text-muted-foreground">
              {asset.currentAssignedUserName || '—'}
            </TableCell>
            <TableCell className="text-right">
              <Link
                to={`/app/assets/${asset.id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t('app.assets.table.view', 'View')}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

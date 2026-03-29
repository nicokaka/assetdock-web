import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssetListItem } from '@/features/assets/types/asset'

type AssetsListProps = {
  assets: AssetListItem[]
}

function formatAssetName(asset: AssetListItem) {
  return asset.displayName || asset.assetTag
}

export function AssetsList({ assets }: AssetsListProps) {
  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <Card key={asset.id} className="border-border shadow-none">
          <CardHeader className="gap-1">
            <CardTitle className="text-base font-medium">
              <Link
                to={`/app/assets/${asset.id}`}
                className="transition-colors hover:text-primary"
              >
                {formatAssetName(asset)}
              </Link>
            </CardTitle>
            <CardDescription>{asset.assetTag}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <span>Status: {asset.status}</span>
            {asset.serialNumber ? <span>Serial: {asset.serialNumber}</span> : null}
            {asset.archivedAt ? <span>Archived</span> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

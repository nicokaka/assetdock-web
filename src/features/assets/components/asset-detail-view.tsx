import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AssetDetail } from '@/features/assets/types/asset'

type AssetDetailViewProps = {
  asset: AssetDetail
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value || 'Not provided'}</div>
    </div>
  )
}

export function AssetDetailView({ asset }: AssetDetailViewProps) {
  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {asset.displayName || asset.assetTag}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{asset.assetTag}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow label="Status" value={asset.status} />
        <DetailRow label="Serial number" value={asset.serialNumber} />
        <DetailRow label="Hostname" value={asset.hostname} />
        <DetailRow label="Description" value={asset.description} />
      </CardContent>
    </Card>
  )
}

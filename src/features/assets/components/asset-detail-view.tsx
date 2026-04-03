import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetAssignmentsSection } from '@/features/assignments/components/asset-assignments-section'
import {
  useArchiveAssetMutation,
  useUpdateAssetStatusMutation,
} from '@/features/assets/hooks/use-asset-lifecycle-actions'
import type { AssetDetail } from '@/features/assets/types/asset'
import { HttpError } from '@/lib/http-client'
import { cn } from '@/lib/utils'

type AssetDetailViewProps = {
  asset: AssetDetail
}

const statusOptions = [
  'ACTIVE',
  'INACTIVE',
  'IN_STOCK',
  'IN_MAINTENANCE',
  'RETIRED',
  'LOST',
] as const

const statusLabels: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  IN_STOCK: 'In Stock',
  IN_MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  LOST: 'Lost',
}

function statusClassName(status: string) {
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
    default:
      return 'border-border/70 bg-background/80 text-muted-foreground'
  }
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
      <div className="text-sm text-foreground">
        {label === 'Archived at' && value
          ? new Date(value).toLocaleString()
          : value || 'Not provided'}
      </div>
    </div>
  )
}

export function AssetDetailView({ asset }: AssetDetailViewProps) {
  const [draftStatus, setDraftStatus] = useState<AssetDetail['status'] | null>(null)
  const updateStatusMutation = useUpdateAssetStatusMutation(asset.id)
  const archiveAssetMutation = useArchiveAssetMutation(asset.id)
  const isArchived = Boolean(asset.archivedAt)
  const status = draftStatus ?? asset.status

  async function handleStatusSubmit() {
    await updateStatusMutation.mutateAsync(status)
    setDraftStatus(null)
  }

  async function handleArchive() {
    const confirmed = window.confirm(
      'Archive this asset? This action is intended for retired or lost assets.',
    )

    if (!confirmed) {
      return
    }

    await archiveAssetMutation.mutateAsync()
  }

  const statusErrorMessage =
    updateStatusMutation.error instanceof HttpError && updateStatusMutation.error.status === 400
      ? 'Unable to update the status with the current asset state.'
      : updateStatusMutation.isError
        ? 'Unable to update the status right now.'
        : undefined

  const archiveErrorMessage =
    archiveAssetMutation.error instanceof HttpError && archiveAssetMutation.error.status === 400
      ? 'Unable to archive this asset in its current state.'
      : archiveAssetMutation.isError
        ? 'Unable to archive this asset right now.'
        : undefined

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {asset.displayName || asset.assetTag}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{asset.assetTag}</p>
          <div>
            <Button asChild variant="outline">
              <Link to={`/app/assets/${asset.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <div>
              <span className={cn(
                'inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em]',
                statusClassName(asset.status)
              )}>
                {statusLabels[asset.status] ?? asset.status}
              </span>
            </div>
          </div>
          <div className="space-y-3 rounded-md border border-border p-4">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-foreground">Lifecycle</h2>
              <p className="text-sm text-muted-foreground">
                Update the current status or archive the asset when appropriate.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Status</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setDraftStatus(event.target.value as AssetDetail['status'])
                  }
                  disabled={isArchived || updateStatusMutation.isPending}
                  className="h-9 min-w-48 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {statusLabels[option] ?? option}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleStatusSubmit()}
                disabled={isArchived || status === asset.status || updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? 'Saving...' : 'Save status'}
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {isArchived
                  ? 'This asset has already been archived.'
                  : 'Archive is intended for retired or lost assets.'}
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleArchive()}
                disabled={isArchived || archiveAssetMutation.isPending}
              >
                {archiveAssetMutation.isPending ? 'Archiving...' : 'Archive asset'}
              </Button>
            </div>

            {statusErrorMessage ? (
              <p className="text-sm text-destructive">{statusErrorMessage}</p>
            ) : null}
            {archiveErrorMessage ? (
              <p className="text-sm text-destructive">{archiveErrorMessage}</p>
            ) : null}
          </div>
          <DetailRow label="Serial number" value={asset.serialNumber} />
          <DetailRow label="Hostname" value={asset.hostname} />
          <DetailRow label="Description" value={asset.description} />
          <DetailRow label="Archived at" value={asset.archivedAt} />
        </CardContent>
      </Card>

      <AssetAssignmentsSection assetId={asset.id} />
    </div>
  )
}

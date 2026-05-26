import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AssetAssignmentsSection } from '@/features/assignments/components/asset-assignments-section'
import { QrCodeViewer } from './qr-code-viewer'
import { CheckoutDialog } from '@/features/checkout/components/checkout-dialog'
import { CheckinDialog } from '@/features/checkout/components/checkin-dialog'
import { AssetTimeline } from './asset-timeline'
import {
  useArchiveAssetMutation,
  useUpdateAssetStatusMutation,
} from '@/features/assets/hooks/use-asset-lifecycle-actions'
import type { AssetDetail, AssetStatus } from '@/features/assets/types/asset'
import { assetStatusClassName, assetStatusLabels } from '@/features/assets/constants/labels'
import { DetailRow } from '@/components/ui/detail-row'
import { formatTimestamp } from '@/lib/format'
import { HttpError } from '@/lib/http-client'
import { cn } from '@/lib/utils'

type AssetDetailViewProps = {
  asset: AssetDetail
}


// M-4: Valid manual status transitions per current status.
// ASSIGNED and IN_STOCK transitions via checkout/checkin are handled separately.
const VALID_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  IN_STOCK:       ['IN_STOCK', 'IN_MAINTENANCE', 'RETIRED', 'LOST'],
  ASSIGNED:       ['ASSIGNED', 'IN_MAINTENANCE', 'RETIRED', 'LOST'],
  IN_MAINTENANCE: ['IN_MAINTENANCE', 'IN_STOCK', 'RETIRED', 'LOST'],
  RETIRED:        ['RETIRED', 'LOST'],
  LOST:           ['LOST', 'RETIRED'],
}


export function AssetDetailView({ asset }: AssetDetailViewProps) {
  const { t } = useTranslation()
  const [draftStatus, setDraftStatus] = useState<AssetDetail['status'] | null>(null)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const updateStatusMutation = useUpdateAssetStatusMutation(asset.id)
  const archiveAssetMutation = useArchiveAssetMutation(asset.id)
  const isArchived = Boolean(asset.archivedAt)
  const status = draftStatus ?? asset.status

  async function handleStatusSubmit() {
    await updateStatusMutation.mutateAsync(status)
    setDraftStatus(null)
  }

  async function handleArchive() {
    try {
      await archiveAssetMutation.mutateAsync()
      setIsArchiveOpen(false)
    } catch {
      // react-query shows error state
    }
  }

  const statusErrorMessage =
    updateStatusMutation.error instanceof HttpError && updateStatusMutation.error.status === 400
      ? t('assetForm.errorGeneric', 'Unable to update the status with the current asset state.')
      : updateStatusMutation.isError
        ? t('assetForm.errorGeneric', 'Unable to update the status right now.')
        : undefined

  const archiveErrorMessage =
    archiveAssetMutation.error instanceof HttpError && archiveAssetMutation.error.status === 400
      ? t('assetForm.errorGeneric', 'Unable to archive this asset in its current state.')
      : archiveAssetMutation.isError
        ? t('assetForm.errorGeneric', 'Unable to archive this asset right now.')
        : undefined

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1 flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {asset.displayName || asset.assetTag}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{asset.assetTag}</p>
          </div>
          <div className="flex items-center gap-2">
            {asset.status === 'IN_STOCK' && (
              <CheckoutDialog assetId={asset.id} assetName={asset.displayName || asset.assetTag} />
            )}
            {asset.status === 'ASSIGNED' && (
              <CheckinDialog assetId={asset.id} assetName={asset.displayName || asset.assetTag} />
            )}
            <QrCodeViewer assetId={asset.id} assetTag={asset.assetTag} />
            <Button asChild variant="outline" size="sm">
              <Link to={`/app/assets/${asset.id}/edit`}>{t('details.actions.edit', 'Edit')}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
            <div className="text-sm text-muted-foreground">{t('assetForm.labels.status', 'Status')}</div>
            <div>
              <span className={cn(
                'inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em]',
                assetStatusClassName(asset.status)
              )}>
                {t(`app.overview.status.${asset.status}`, assetStatusLabels[asset.status] ?? asset.status)}
              </span>
            </div>
          </div>
          <div className="space-y-3 rounded-md border border-border p-4">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-foreground">{t('details.sections.lifecycle', 'Lifecycle')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('assetForm.descriptionEdit', 'Update the current status or archive the asset when appropriate.')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">{t('assetForm.labels.status', 'Status')}</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setDraftStatus(event.target.value as AssetDetail['status'])
                  }
                  disabled={isArchived || updateStatusMutation.isPending}
                  className="h-9 min-w-48 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                >
                  {(VALID_TRANSITIONS[asset.status as AssetStatus] ?? [asset.status as AssetStatus]).map((option) => (
                    <option key={option} value={option}>
                      {t(`app.overview.status.${option}`, assetStatusLabels[option] ?? option)}
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
                {updateStatusMutation.isPending ? t('assetForm.submittingEdit', 'Saving...') : t('assetForm.submitEdit', 'Save status')}
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {isArchived
                  ? t('details.asset.notFound', 'This asset has already been archived.')
                  : t('details.asset.archiveDescription', 'Archive is intended for retired or lost assets.')}
              </p>
              <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isArchived || archiveAssetMutation.isPending}
                  >
                    {archiveAssetMutation.isPending ? t('assetForm.submittingEdit', 'Archiving...') : t('details.actions.archive', 'Archive asset')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('details.asset.archiveTitle', 'Archive this asset?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('details.asset.archiveDescription', 'This action is intended for retired or lost assets. It will mark the asset as archived. Are you sure you want to proceed?')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('details.asset.archiveCancel', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault()
                        void handleArchive()
                      }}
                      disabled={archiveAssetMutation.isPending}
                    >
                      {t('details.asset.archiveConfirm', 'Archive')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {statusErrorMessage ? (
              <p className="text-sm text-destructive">{statusErrorMessage}</p>
            ) : null}
            {archiveErrorMessage ? (
              <p className="text-sm text-destructive">{archiveErrorMessage}</p>
            ) : null}
          </div>
          <DetailRow label={t('assetForm.labels.serialNumber', 'Serial number')} value={asset.serialNumber} />
          <DetailRow label={t('assetForm.labels.hostname', 'Hostname')} value={asset.hostname} />
          <DetailRow label={t('assetForm.labels.description', 'Description')} value={asset.description} />
          {asset.status === 'ASSIGNED' && asset.currentAssignedUserName && (
            <DetailRow label={t('details.labels.assignedTo', 'Assigned to')} value={asset.currentAssignedUserName} />
          )}
          {asset.purchaseDate && (
            <DetailRow label={t('details.labels.purchaseDate', 'Purchase date')} value={formatTimestamp(asset.purchaseDate).split(' ')[0]} />
          )}
          {asset.warrantyExpiryDate && (
            <DetailRow label={t('details.labels.warrantyExpiryDate', 'Warranty expiration')} value={formatTimestamp(asset.warrantyExpiryDate).split(' ')[0]} />
          )}
          <DetailRow label={t('details.labels.createdAt', 'Created at')} value={formatTimestamp(asset.createdAt)} />
          <DetailRow label={t('details.labels.updatedAt', 'Last updated')} value={formatTimestamp(asset.updatedAt)} />
          {isArchived ? <DetailRow label={t('details.badges.archived', 'Archived at')} value={formatTimestamp(asset.archivedAt)} /> : null}
        </CardContent>
      </Card>

      <AssetAssignmentsSection assetId={asset.id} />

      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">{t('app.timeline.title', 'Lifecycle Timeline')}</CardTitle>
          <CardDescription>
            {t('app.timeline.description', 'History of all events related to this asset')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetTimeline assetId={asset.id} />
        </CardContent>
      </Card>
    </div>
  )
}

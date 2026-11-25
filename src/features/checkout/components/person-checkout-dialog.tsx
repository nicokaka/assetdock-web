import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Laptop, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { HttpError } from '@/lib/http-client'
import { cn } from '@/lib/utils'
import { useCheckoutMutation } from '../hooks/use-checkout-actions'

interface PersonCheckoutDialogProps {
  personId: string
  personName: string
}

export function PersonCheckoutDialog({ personId, personName }: PersonCheckoutDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [expectedReturnDate, setExpectedReturnDate] = useState('')
  const [notes, setNotes] = useState('')

  const assetsQuery = useAssetsQuery({ status: 'IN_STOCK', size: 100 })
  const checkoutMutation = useCheckoutMutation()

  const availableAssets = useMemo(
    () =>
      (assetsQuery.data?.items ?? []).filter(
        (asset) => !asset.archivedAt && asset.status === 'IN_STOCK',
      ),
    [assetsQuery.data],
  )

  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return availableAssets
    return availableAssets.filter((asset) => {
      const nameMatch = asset.displayName?.toLowerCase().includes(q) ?? false
      const tagMatch = asset.assetTag.toLowerCase().includes(q)
      const serialMatch = asset.serialNumber?.toLowerCase().includes(q) ?? false
      return nameMatch || tagMatch || serialMatch
    })
  }, [availableAssets, search])

  const resetForm = () => {
    setSearch('')
    setSelectedAssetId('')
    setExpectedReturnDate('')
    setNotes('')
    checkoutMutation.reset()
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssetId) return

    try {
      await checkoutMutation.mutateAsync({
        assetId: selectedAssetId,
        personId,
        expectedReturnDate: expectedReturnDate
          ? new Date(`${expectedReturnDate}T23:59:59`).toISOString()
          : undefined,
        notes: notes.trim() || undefined,
      })
      setIsOpen(false)
      resetForm()
    } catch (error) {
      const message =
        error instanceof HttpError && error.message
          ? error.message
          : t('app.checkout.error', 'Failed to assign asset. Please try again.')
      toast.error(message)
    }
  }

  const errorMessage = checkoutMutation.isError
    ? checkoutMutation.error instanceof HttpError && checkoutMutation.error.message
      ? checkoutMutation.error.message
      : t('app.checkout.error', 'Unable to assign this asset right now.')
    : null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Laptop className="h-4 w-4" />
          {t('app.checkout.button', 'Assign asset')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('app.checkout.assignAssetToPersonTitle', 'Assign asset to person')}</DialogTitle>
            <DialogDescription>
              {t(
                'app.checkout.assignAssetToPersonDescription',
                'Select an in-stock asset to hand over to this person.',
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>{t('app.checkout.user', 'Person')}</Label>
              <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">{personName}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`person-checkout-search-${personId}`}>
                {t('app.checkout.selectAsset', 'In-stock asset')}{' '}
                <span className="text-muted-foreground">*</span>
              </Label>

              {assetsQuery.isPending ? (
                <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
                  {t('common.loading', 'Loading...')}
                </div>
              ) : availableAssets.length === 0 ? (
                <div className="space-y-2 rounded-md border border-dashed border-border p-3 text-sm">
                  <p className="text-muted-foreground">
                    {t('app.checkout.noAssetsAvailable', 'No in-stock assets available to assign.')}
                  </p>
                  <Link
                    to="/app/assets/new"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t('app.checkout.createAssetLink', 'Create an asset')}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`person-checkout-search-${personId}`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t(
                        'app.checkout.searchAssetsPlaceholder',
                        'Search by name, tag, or serial number...',
                      )}
                      className="pl-8"
                      disabled={checkoutMutation.isPending}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-md border border-border divide-y divide-border/60">
                    {filteredAssets.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        {t('app.checkout.noMatchingAssets', 'No available assets match your search.')}
                      </p>
                    ) : (
                      filteredAssets.map((asset) => {
                        const isSelected = asset.id === selectedAssetId
                        const label = asset.displayName || asset.assetTag
                        const meta = [asset.assetTag, asset.serialNumber].filter(Boolean).join(' • ')
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => setSelectedAssetId(asset.id)}
                            disabled={checkoutMutation.isPending}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60',
                              isSelected && 'bg-primary/5 font-medium text-foreground',
                            )}
                          >
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">{label}</div>
                              <div className="truncate font-mono text-xs text-muted-foreground">{meta}</div>
                            </div>
                            {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                          </button>
                        )
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`person-checkout-return-date-${personId}`}>
                {t('app.checkout.expectedReturn', 'Expected Return Date')}
              </Label>
              <Input
                id={`person-checkout-return-date-${personId}`}
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={checkoutMutation.isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`person-checkout-notes-${personId}`}>{t('app.checkout.notes', 'Notes')}</Label>
              <Textarea
                id={`person-checkout-notes-${personId}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t(
                  'app.checkout.notesPlaceholder',
                  'Accessories included, condition, loan reason...',
                )}
                disabled={checkoutMutation.isPending}
              />
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={checkoutMutation.isPending}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={!selectedAssetId || checkoutMutation.isPending}>
              {checkoutMutation.isPending
                ? t('common.saving', 'Saving...')
                : t('app.checkout.submit', 'Confirm assignment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDownToLine } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HttpError } from '@/lib/http-client'
import { useCheckinMutation } from '../hooks/use-checkout-actions'

interface CheckinDialogProps {
  assetId: string
  assetName: string
}

export function CheckinDialog({ assetId, assetName }: CheckinDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const checkinMutation = useCheckinMutation(assetId)

  const resetForm = () => {
    setNotes('')
    checkinMutation.reset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await checkinMutation.mutateAsync({
        notes: notes.trim() || undefined,
      })
      setIsOpen(false)
      resetForm()
    } catch (error) {
      const message =
        error instanceof HttpError && error.message
          ? error.message
          : t('app.checkin.error', 'Failed to return asset. Please try again.')
      toast.error(message)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const errorMessage = checkinMutation.isError
    ? checkinMutation.error instanceof HttpError && checkinMutation.error.message
      ? checkinMutation.error.message
      : t('app.checkin.error', 'Unable to return this asset right now.')
    : null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          {t('app.checkin.button', 'Return asset')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('app.checkin.title', 'Return asset to stock')}</DialogTitle>
            <DialogDescription>
              {t('app.checkin.description', 'Return this asset to the inventory.')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>{t('app.checkin.asset', 'Asset')}</Label>
              <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">{assetName}</div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`checkin-notes-${assetId}`}>{t('app.checkin.notes', 'Return Notes')}</Label>
              <Textarea
                id={`checkin-notes-${assetId}`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('app.checkin.notesPlaceholder', 'Condition upon return, issues found, etc.')}
                disabled={checkinMutation.isPending}
              />
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={checkinMutation.isPending}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={checkinMutation.isPending}>
              {checkinMutation.isPending
                ? t('common.saving', 'Saving...')
                : t('app.checkin.submit', 'Confirm return')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

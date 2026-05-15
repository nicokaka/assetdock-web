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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await checkinMutation.mutateAsync({
        notes: notes || undefined,
      })
      setIsOpen(false)
      setNotes('')
    } catch (error) {
      // H-4: Show error toast and keep dialog open so the user can retry.
      const message =
        error instanceof HttpError
          ? error.message
          : t('app.checkin.error', 'Failed to check in asset. Please try again.')
      toast.error(message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          {t('app.checkin.button', 'Check-in')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('app.checkin.title', 'Check-in Asset')}</DialogTitle>
            <DialogDescription>
              {t('app.checkin.description', 'Return this asset to the inventory.')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t('app.checkin.asset', 'Asset')}</Label>
              <div className="text-sm font-medium p-2 bg-muted rounded-md">{assetName}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('app.checkin.notes', 'Return Notes')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('app.checkin.notesPlaceholder', 'Condition upon return, issues found, etc.')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={checkinMutation.isPending}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={checkinMutation.isPending}>
              {checkinMutation.isPending ? t('common.saving', 'Saving...') : t('app.checkin.submit', 'Confirm Check-in')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

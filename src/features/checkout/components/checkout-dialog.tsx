import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckSquare } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HttpError } from '@/lib/http-client'
import { useCheckoutMutation } from '../hooks/use-checkout-actions'
import { usePeopleQuery } from '@/features/people/hooks/use-people'

interface CheckoutDialogProps {
  assetId: string
  assetName: string
}

export function CheckoutDialog({ assetId, assetName }: CheckoutDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [personId, setPersonId] = useState<string>('')
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>('')
  const [notes, setNotes] = useState('')

  const checkoutMutation = useCheckoutMutation(assetId)
  const peopleQuery = usePeopleQuery()
  const people = peopleQuery.data?.items ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personId) return

    try {
      await checkoutMutation.mutateAsync({
        personId,
        expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate).toISOString() : undefined,
        notes: notes || undefined,
      })
      setIsOpen(false)
      setPersonId('')
      setExpectedReturnDate('')
      setNotes('')
    } catch (error) {
      // H-4: Show error toast and keep dialog open so the user can retry.
      const message =
        error instanceof HttpError
          ? error.message
          : t('app.checkout.error', 'Failed to check out asset. Please try again.')
      toast.error(message)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      checkoutMutation.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          {t('app.checkout.button', 'Check-out')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('app.checkout.title', 'Check-out Asset')}</DialogTitle>
            <DialogDescription>
              {t('app.checkout.description', 'Assign this asset temporarily to a person.')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t('app.checkout.asset', 'Asset')}</Label>
              <div className="text-sm font-medium p-2 bg-muted rounded-md">{assetName}</div>
            </div>

            {/* M-1: Use shadcn Select for visual consistency. L-5: Label uses standard styling. */}
            <div className="space-y-2">
              <Label htmlFor="personId">
                {t('app.checkout.user', 'Person')}{' '}
                <span className="text-muted-foreground">*</span>
              </Label>
              <Select
                value={personId}
                onValueChange={setPersonId}
                disabled={checkoutMutation.isPending || peopleQuery.isPending}
              >
                <SelectTrigger id="personId">
                  <SelectValue
                    placeholder={
                      peopleQuery.isPending
                        ? t('common.loading', 'Loading...')
                        : t('details.assignments.selectUser', 'Select a person')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.fullName} {person.email ? `(${person.email})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedReturnDate">{t('app.checkout.expectedReturn', 'Expected Return Date')}</Label>
              <Input
                id="expectedReturnDate"
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('app.checkout.notes', 'Notes')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('app.checkout.notesPlaceholder', 'Reason for checkout, condition, etc.')}
              />
            </div>
          </div>

          {checkoutMutation.isError ? (
            <p className="text-sm text-destructive px-1">
              {t('app.checkout.error', 'Unable to check out this asset. Please try again.')}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={checkoutMutation.isPending}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={!personId || checkoutMutation.isPending}>
              {checkoutMutation.isPending ? t('common.saving', 'Saving...') : t('app.checkout.submit', 'Confirm Check-out')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

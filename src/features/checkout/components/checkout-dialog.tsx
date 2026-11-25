import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, CheckSquare, Search, UserPlus } from 'lucide-react'
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
import { HttpError } from '@/lib/http-client'
import { cn } from '@/lib/utils'
import { useCheckoutMutation } from '../hooks/use-checkout-actions'
import { usePeopleQuery } from '@/features/people/hooks/use-people'

interface CheckoutDialogProps {
  assetId: string
  assetName: string
}

export function CheckoutDialog({ assetId, assetName }: CheckoutDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [personId, setPersonId] = useState<string>('')
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>('')
  const [notes, setNotes] = useState('')

  const checkoutMutation = useCheckoutMutation(assetId)
  const peopleQuery = usePeopleQuery()

  const activePeople = useMemo(
    () => (peopleQuery.data?.items ?? []).filter((person) => person.active),
    [peopleQuery.data],
  )

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return activePeople
    return activePeople.filter((person) => {
      const nameMatch = person.fullName.toLowerCase().includes(q)
      const emailMatch = person.email?.toLowerCase().includes(q) ?? false
      const deptMatch = person.department?.toLowerCase().includes(q) ?? false
      return nameMatch || emailMatch || deptMatch
    })
  }, [activePeople, search])

  const resetForm = () => {
    setSearch('')
    setPersonId('')
    setExpectedReturnDate('')
    setNotes('')
    checkoutMutation.reset()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personId) return

    try {
      await checkoutMutation.mutateAsync({
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
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
          <CheckSquare className="h-4 w-4" />
          {t('app.checkout.button', 'Assign asset')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('app.checkout.title', 'Assign asset')}</DialogTitle>
            <DialogDescription>
              {t('app.checkout.description', 'Assign this asset to an active person.')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>{t('app.checkout.asset', 'Asset')}</Label>
              <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">{assetName}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`checkout-person-search-${assetId}`}>
                {t('app.checkout.user', 'Person')}{' '}
                <span className="text-muted-foreground">*</span>
              </Label>

              {peopleQuery.isPending ? (
                <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
                  {t('common.loading', 'Loading...')}
                </div>
              ) : activePeople.length === 0 ? (
                <div className="space-y-2 rounded-md border border-dashed border-border p-3 text-sm">
                  <p className="text-muted-foreground">
                    {t('app.checkout.noPeopleTitle', 'No active people registered yet.')}
                  </p>
                  <Link
                    to="/app/people/new"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t('app.checkout.createPersonLink', 'Create a person')}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`checkout-person-search-${assetId}`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t(
                        'app.checkout.searchPeoplePlaceholder',
                        'Search by name, email, or department...',
                      )}
                      className="pl-8"
                      disabled={checkoutMutation.isPending}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-md border border-border divide-y divide-border/60">
                    {filteredPeople.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        {t('app.checkout.noMatchingPeople', 'No active people match your search.')}
                      </p>
                    ) : (
                      filteredPeople.map((person) => {
                        const isSelected = person.id === personId
                        const subtitle = [person.email, person.department].filter(Boolean).join(' • ')
                        return (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => setPersonId(person.id)}
                            disabled={checkoutMutation.isPending}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60',
                              isSelected && 'bg-primary/5 font-medium text-foreground',
                            )}
                          >
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">{person.fullName}</div>
                              {subtitle ? (
                                <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
                              ) : null}
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
              <Label htmlFor={`checkout-return-date-${assetId}`}>
                {t('app.checkout.expectedReturn', 'Expected Return Date')}
              </Label>
              <Input
                id={`checkout-return-date-${assetId}`}
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={checkoutMutation.isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`checkout-notes-${assetId}`}>{t('app.checkout.notes', 'Notes')}</Label>
              <Textarea
                id={`checkout-notes-${assetId}`}
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
            <Button type="submit" disabled={!personId || checkoutMutation.isPending}>
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

import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { useChangePassword } from '@/features/users/hooks/use-change-password'
import { HttpError } from '@/lib/http-client'

interface ChangePasswordDialogProps {
  userId: string
}

const UPPERCASE_REGEX = /[A-Z]/
const DIGIT_REGEX = /[0-9]/
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_=+[\]{}|;:'",.<>?/`~-]/

function isValidPasswordPolicy(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 72 &&
    UPPERCASE_REGEX.test(password) &&
    DIGIT_REGEX.test(password) &&
    SPECIAL_CHAR_REGEX.test(password)
  )
}

export function ChangePasswordDialog({ userId }: ChangePasswordDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const changePasswordMutation = useChangePassword({
    userId,
    onSuccess: () => {
      toast.success(
        t('auth.changePassword.success', 'Password changed. Please sign in with your new password.'),
      )
      setOpen(false)
    },
  })

  function resetFormState() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setValidationError(null)
    changePasswordMutation.reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetFormState()
    }
  }

  function clearErrorsOnInput() {
    if (validationError) setValidationError(null)
    if (changePasswordMutation.isError) changePasswordMutation.reset()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidPasswordPolicy(newPassword)) {
      setValidationError(
        t(
          'auth.changePassword.policyError',
          'New password must be 8-72 characters and include at least one uppercase letter, one number, and one special character.',
        ),
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setValidationError(
        t('auth.changePassword.mismatchError', 'New password and confirmation do not match.'),
      )
      return
    }

    setValidationError(null)
    changePasswordMutation.mutate({ currentPassword, newPassword })
  }

  const mutationErrorMessage = changePasswordMutation.isError
    ? changePasswordMutation.error instanceof HttpError && changePasswordMutation.error.message
      ? changePasswordMutation.error.message
      : t('auth.changePassword.error', 'Unable to change your password right now.')
    : null
  const displayError = validationError ?? mutationErrorMessage

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border/80 bg-background/80 hover:bg-accent/80"
          title={t('auth.changePassword.trigger', 'Change password')}
          aria-label={t('auth.changePassword.trigger', 'Change password')}
        >
          <KeyRound className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">
            {t('auth.changePassword.trigger', 'Change password')}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('auth.changePassword.title', 'Change password')}</DialogTitle>
            <DialogDescription>
              {t(
                'auth.changePassword.description',
                'Update your password. For security reasons, all active sessions will be signed out.',
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">
                {t('auth.changePassword.currentPasswordLabel', 'Current password')}
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  clearErrorsOnInput()
                }}
                placeholder={t(
                  'auth.changePassword.currentPasswordPlaceholder',
                  'Enter current password',
                )}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="self-new-password">
                {t('auth.changePassword.newPasswordLabel', 'New password')}
              </Label>
              <Input
                id="self-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  clearErrorsOnInput()
                }}
                placeholder={t('auth.changePassword.newPasswordPlaceholder', 'Enter new password')}
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-muted-foreground">
                {t(
                  'userForm.passwordRequirements',
                  '8–72 characters, including at least one uppercase letter, one number, and one special character.',
                )}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">
                {t('auth.changePassword.confirmPasswordLabel', 'Confirm new password')}
              </Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  clearErrorsOnInput()
                }}
                placeholder={t(
                  'auth.changePassword.confirmPasswordPlaceholder',
                  'Confirm new password',
                )}
                autoComplete="new-password"
                required
              />
            </div>

            {displayError ? <p className="text-sm text-destructive">{displayError}</p> : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={changePasswordMutation.isPending}
            >
              {t('details.asset.archiveCancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                changePasswordMutation.isPending ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              {changePasswordMutation.isPending
                ? t('auth.changePassword.submitting', 'Updating...')
                : t('auth.changePassword.submit', 'Update password')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

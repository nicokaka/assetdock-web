import { useState } from 'react'

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
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { useResetPassword } from '@/features/users/hooks/use-reset-password'

interface AdminResetPasswordDialogProps {
  userId: string
  userRoles: string[]
}

export function AdminResetPasswordDialog({ userId, userRoles }: AdminResetPasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { data: session } = useSessionQuery()
  
  const resetPasswordMutation = useResetPassword({
    userId,
    onSuccess: () => {
      setSuccess(true)
      setNewPassword('')
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 2000)
    },
  })

  // Only ORG_ADMIN and SUPER_ADMIN can reset passwords.
  // ORG_ADMIN cannot reset SUPER_ADMIN passwords.
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'
  const isOrgAdmin = session?.user?.role === 'ORG_ADMIN'
  const isTargetSuperAdmin = userRoles.includes('SUPER_ADMIN')
  
  const canResetPassword = isSuperAdmin || (isOrgAdmin && !isTargetSuperAdmin)

  if (!canResetPassword) {
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (newPassword.length < 8) {
      // Basic validation check before sending
      return
    }
    
    resetPasswordMutation.mutate({ newPassword })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive hover:text-destructive">
          Reset password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reset user password</DialogTitle>
            <DialogDescription>
              Set a new temporary password for this user. This will revoke all their active sessions and unlock their account if it is locked.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              {success ? (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Password reset successfully. Closing...
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={resetPasswordMutation.isPending || success}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={resetPasswordMutation.isPending || newPassword.length === 0 || success}>
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { userRoleLabels, userStatusLabels } from '@/features/users/constants/labels'
import { useUpdateUserRoles, useUpdateUserStatus } from '@/features/users/hooks/use-user-lifecycle-actions'
import type { UserDetail, UserRole, UserStatus } from '@/features/users/types/user'
import { userRoleOptions, userStatusOptions } from '@/features/users/types/user-form'
import { HttpError } from '@/lib/http-client'

type UserLifecycleActionsProps = {
  user: UserDetail
}

export function UserLifecycleActions({ user }: UserLifecycleActionsProps) {
  const { t } = useTranslation()
  const [statusValue, setStatusValue] = useState<UserStatus>(user.status)
  const [roleValues, setRoleValues] = useState<UserRole[]>(user.roles)

  const updateStatusMutation = useUpdateUserStatus(user.id)
  const updateRolesMutation = useUpdateUserRoles(user.id)

  const statusErrorMessage =
    updateStatusMutation.error instanceof HttpError && updateStatusMutation.error.status === 400
      ? t('userForm.errorGeneric', 'Unable to save the selected status.')
      : updateStatusMutation.isError
        ? t('userForm.errorGeneric', 'Unable to update status right now.')
        : undefined

  const rolesErrorMessage =
    updateRolesMutation.error instanceof HttpError && updateRolesMutation.error.status === 400
      ? t('userForm.errorGeneric', 'Unable to save the selected roles.')
      : updateRolesMutation.isError
        ? t('userForm.errorGeneric', 'Unable to update roles right now.')
        : undefined

  return (
    <>
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">{t('userForm.labels.status', 'Status')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value as UserStatus)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {userStatusOptions.map((status) => (
              <option key={status} value={status}>
                {t(`userForm.status.${status.toLowerCase()}`, userStatusLabels[status] ?? status)}
              </option>
            ))}
          </select>
          {statusErrorMessage ? (
            <p className="text-sm text-destructive">{statusErrorMessage}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={updateStatusMutation.isPending || statusValue === user.status}
            onClick={async () => {
              await updateStatusMutation.mutateAsync(statusValue)
            }}
          >
            {updateStatusMutation.isPending ? t('userForm.submittingEdit', 'Saving...') : t('userForm.submitEdit', 'Save status')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">{t('userForm.labels.roles', 'Roles')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            multiple
            value={roleValues}
            onChange={(event) => {
              const values = Array.from(
                event.target.selectedOptions,
                (option) => option.value as UserRole,
              )
              setRoleValues(values)
            }}
            className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {userRoleOptions.map((role) => (
              <option key={role} value={role}>
                {t(`userForm.roles.${role.toLowerCase()}`, userRoleLabels[role] ?? role)}
              </option>
            ))}
          </select>
          {rolesErrorMessage ? (
            <p className="text-sm text-destructive">{rolesErrorMessage}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={
              updateRolesMutation.isPending ||
              JSON.stringify([...roleValues].sort()) === JSON.stringify([...user.roles].sort())
            }
            onClick={async () => {
              await updateRolesMutation.mutateAsync(roleValues)
            }}
          >
            {updateRolesMutation.isPending ? t('userForm.submittingEdit', 'Saving...') : t('userForm.submitEdit', 'Save roles')}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

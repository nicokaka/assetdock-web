import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { userRoleOptions, userStatusOptions } from '@/features/users/types/user-form'
import { useUpdateUserRoles, useUpdateUserStatus } from '@/features/users/hooks/use-user-lifecycle-actions'
import type { UserDetail, UserRole, UserStatus } from '@/features/users/types/user'
import { HttpError } from '@/lib/http-client'

type UserDetailViewProps = {
  user: UserDetail
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  )
}

function formatRoles(roles: UserDetail['roles']) {
  return roles.length > 0 ? roles.join(', ') : 'No roles'
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString()
}

export function UserDetailView({ user }: UserDetailViewProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {user.fullName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow label="Status" value={user.status} />
          <DetailRow label="Roles" value={formatRoles(user.roles)} />
          <DetailRow label="Created" value={formatTimestamp(user.createdAt)} />
          <DetailRow label="Updated" value={formatTimestamp(user.updatedAt)} />
        </CardContent>
      </Card>

      <UserLifecycleActions
        key={`${user.status}:${user.roles.join(',')}:${user.updatedAt}`}
        user={user}
      />
    </div>
  )
}

function UserLifecycleActions({ user }: UserDetailViewProps) {
  const [statusValue, setStatusValue] = useState<UserStatus>(user.status)
  const [roleValues, setRoleValues] = useState<UserRole[]>(user.roles)

  const updateStatusMutation = useUpdateUserStatus(user.id)
  const updateRolesMutation = useUpdateUserRoles(user.id)

  const statusErrorMessage =
    updateStatusMutation.error instanceof HttpError && updateStatusMutation.error.status === 400
      ? 'Unable to save the selected status.'
      : updateStatusMutation.isError
        ? 'Unable to update status right now.'
        : undefined

  const rolesErrorMessage =
    updateRolesMutation.error instanceof HttpError && updateRolesMutation.error.status === 400
      ? 'Unable to save the selected roles.'
      : updateRolesMutation.isError
        ? 'Unable to update roles right now.'
        : undefined

  return (
    <>
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value as UserStatus)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {userStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
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
            {updateStatusMutation.isPending ? 'Saving status...' : 'Save status'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">Roles</CardTitle>
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
                {role}
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
            {updateRolesMutation.isPending ? 'Saving roles...' : 'Save roles'}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

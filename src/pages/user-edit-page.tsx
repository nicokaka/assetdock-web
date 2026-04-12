import { Link, useNavigate, useParams } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserEditForm } from '@/features/users/components/user-edit-form'
import { useUpdateUserMutation } from '@/features/users/hooks/use-update-user'
import {
  useUpdateUserRoles,
  useUpdateUserStatus,
} from '@/features/users/hooks/use-user-lifecycle-actions'
import { useUserDetailQuery } from '@/features/users/hooks/use-users'
import type { UserEditFormValues } from '@/features/users/types/user-form'
import { toUpdateUserProfileInput } from '@/features/users/types/user-form'
import { HttpError } from '@/lib/http-client'

function toDefaultValues(
  user: NonNullable<ReturnType<typeof useUserDetailQuery>['data']>,
): UserEditFormValues {
  return {
    fullName: user.fullName,
    email: user.email,
    roles: user.roles,
    status: user.status,
  }
}

export function UserEditPage() {
  const navigate = useNavigate()
  const { userId = '' } = useParams()
  const userQuery = useUserDetailQuery(userId)
  const updateUserMutation = useUpdateUserMutation(userId)
  const updateRolesMutation = useUpdateUserRoles(userId)
  const updateStatusMutation = useUpdateUserStatus(userId)

  const isPending =
    updateUserMutation.isPending ||
    updateRolesMutation.isPending ||
    updateStatusMutation.isPending

  const isAnyError =
    updateUserMutation.isError ||
    updateRolesMutation.isError ||
    updateStatusMutation.isError

  const isValidationError =
    (updateUserMutation.error instanceof HttpError && updateUserMutation.error.status === 400) ||
    (updateRolesMutation.error instanceof HttpError && updateRolesMutation.error.status === 400) ||
    (updateStatusMutation.error instanceof HttpError && updateStatusMutation.error.status === 400)

  const errorMessage = isValidationError
    ? 'Unable to save the user with the provided data.'
    : isAnyError
      ? 'Unable to save the user right now.'
      : undefined

  async function handleSubmit(values: UserEditFormValues) {
    const user = userQuery.data!

    const profileChanged =
      values.fullName !== user.fullName || values.email !== user.email

    const rolesChanged =
      values.roles.length !== user.roles.length ||
      !values.roles.every((r) => user.roles.includes(r))

    const statusChanged = values.status !== user.status

    if (profileChanged) {
      await updateUserMutation.mutateAsync(toUpdateUserProfileInput(values))
    }

    if (rolesChanged) {
      await updateRolesMutation.mutateAsync(values.roles)
    }

    if (statusChanged) {
      await updateStatusMutation.mutateAsync(values.status)
    }

    navigate(`/app/users/${userId}`, { replace: true })
  }

  return (
    <section className="space-y-6">
      <div>
        <Link to={`/app/users/${userId}`} className={buttonVariants({ variant: 'outline' })}>
          Back to user
        </Link>
      </div>

      {userQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading user...
          </CardContent>
        </Card>
      ) : null}

      {userQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unable to load user</CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {userQuery.isSuccess ? (
        <Card className="max-w-2xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Edit User
            </CardTitle>
            <CardDescription>
              Update the user profile, roles, and status. Password changes are not supported here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserEditForm
              defaultValues={toDefaultValues(userQuery.data)}
              isPending={isPending}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserDetailView } from '@/features/users/components/user-detail-view'
import { AdminResetPasswordDialog } from '@/features/users/components/admin-reset-password-dialog'
import { useUserDetailQuery } from '@/features/users/hooks/use-users'
import { HttpError } from '@/lib/http-client'

export function UserDetailPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userId = '' } = useParams()
  const userQuery = useUserDetailQuery(userId)

  const isNotFound =
    userQuery.isError &&
    userQuery.error instanceof HttpError &&
    userQuery.error.status === 404

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/app/users')} className={buttonVariants({ variant: 'outline' })}>
          {t('userForm.back', 'Back to users')}
        </button>
        {userQuery.isSuccess ? (
          <>
            <button
              onClick={() => navigate(`/app/users/${userId}/edit`)}
              className={buttonVariants({ variant: 'outline' })}
            >
              {t('details.actions.edit', 'Edit user')}
            </button>
            <AdminResetPasswordDialog userId={userId} userRoles={userQuery.data.roles} />
          </>
        ) : null}
      </div>

      {userQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Loading user</CardTitle>
            <CardDescription>
              Fetching the latest user details.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('details.user.notFound', 'User not found')}</CardTitle>
            <CardDescription>
              {t('app.users.emptyDescriptionFilters', 'The requested user is unavailable for the current session.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {userQuery.isError && !isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.users.errorTitle', 'Unable to load user')}</CardTitle>
            <CardDescription>
              {t('app.users.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {userQuery.isSuccess ? <UserDetailView user={userQuery.data} /> : null}
    </section>
  )
}

import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserDetail } from '@/features/users/types/user'
import { userRoleLabels, userStatusClassName, userStatusLabels } from '@/features/users/constants/labels'
import { UserLifecycleActions } from '@/features/users/components/user-lifecycle-actions'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { canManageUsers } from '@/features/auth/utils/permissions'
import { DetailRow } from '@/components/ui/detail-row'
import { formatTimestamp } from '@/lib/format'
import { cn } from '@/lib/utils'

type UserDetailViewProps = {
  user: UserDetail
}

export function UserDetailView({ user }: UserDetailViewProps) {
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()
  const canEditUsers = canManageUsers(sessionQuery.data?.user.role)

  function formatRoles(roles: UserDetail['roles']) {
    return roles.length > 0
      ? roles.map(r => t(`userForm.roles.${r.toLowerCase()}`, userRoleLabels[r] ?? r)).join(', ')
      : t('details.user.noRoles', 'No roles')
  }

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
          <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
            <div className="text-sm text-muted-foreground">{t('userForm.labels.status', 'Status')}</div>
            <div>
              <span className={cn(
                'inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em]',
                userStatusClassName(user.status)
              )}>
                {t(`userForm.status.${user.status.toLowerCase()}`, userStatusLabels[user.status] ?? user.status)}
              </span>
            </div>
          </div>
          <DetailRow label={t('userForm.labels.roles', 'Roles')} value={formatRoles(user.roles)} />
          <DetailRow label={t('details.labels.createdAt', 'Created at')} value={formatTimestamp(user.createdAt)} />
          <DetailRow label={t('details.labels.updatedAt', 'Last updated')} value={formatTimestamp(user.updatedAt)} />
        </CardContent>
      </Card>

      {canEditUsers ? (
        <UserLifecycleActions
          key={`${user.status}:${user.roles.join(',')}:${user.updatedAt}`}
          user={user}
        />
      ) : null}
    </div>
  )
}


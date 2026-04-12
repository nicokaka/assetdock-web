import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserDetail } from '@/features/users/types/user'
import { userRoleLabels, userStatusClassName, userStatusLabels } from '@/features/users/constants/labels'
import { UserLifecycleActions } from '@/features/users/components/user-lifecycle-actions'
import { DetailRow } from '@/components/ui/detail-row'
import { formatTimestamp } from '@/lib/format'
import { cn } from '@/lib/utils'

type UserDetailViewProps = {
  user: UserDetail
}

function formatRoles(roles: UserDetail['roles']) {
  return roles.length > 0 ? roles.map(r => userRoleLabels[r] ?? r).join(', ') : 'No roles'
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
          <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <div>
              <span className={cn(
                'inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.06em]',
                userStatusClassName(user.status)
              )}>
                {userStatusLabels[user.status] ?? user.status}
              </span>
            </div>
          </div>
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


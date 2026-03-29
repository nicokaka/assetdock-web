import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserDetail } from '@/features/users/types/user'

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
  )
}

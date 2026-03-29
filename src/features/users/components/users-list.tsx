import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserSummary } from '@/features/users/types/user'

type UsersListProps = {
  users: UserSummary[]
}

function formatRoles(roles: UserSummary['roles']) {
  if (roles.length === 0) {
    return 'No roles'
  }

  return roles.join(', ')
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id} className="border-border shadow-none">
          <CardHeader className="gap-1">
            <CardTitle className="text-base font-medium">
              <Link
                to={`/app/users/${user.id}`}
                className="transition-colors hover:text-primary"
              >
                {user.fullName}
              </Link>
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">
            <span>Status: {user.status}</span>
            <span>Roles: {formatRoles(user.roles)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

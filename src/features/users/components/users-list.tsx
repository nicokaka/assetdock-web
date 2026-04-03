import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UserSummary } from '@/features/users/types/user'

type UsersListProps = {
  users: UserSummary[]
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LOCKED: 'Locked',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Org Admin',
  ASSET_MANAGER: 'Asset Manager',
  AUDITOR: 'Auditor',
  VIEWER: 'Viewer',
}

function statusVariant(status: UserSummary['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'success' as const
    case 'INACTIVE':
      return 'muted' as const
    case 'LOCKED':
      return 'danger' as const
  }
}

export function UsersList({ users }: UsersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Badge variant={statusVariant(user.status)}>
                {statusLabels[user.status] ?? user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                to={`/app/users/${user.id}`}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {user.fullName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.email}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-[11px]">
                      {roleLabels[role] ?? role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Link
                to={`/app/users/${user.id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

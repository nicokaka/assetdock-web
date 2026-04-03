import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import type { UserSummary } from '@/features/users/types/user'
import { cn } from '@/lib/utils'

type UsersListProps = {
  users: UserSummary[]
}

function statusClassName(status: UserSummary['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'INACTIVE':
      return 'border-slate-200 bg-slate-100 text-slate-700'
    case 'LOCKED':
      return 'border-rose-200 bg-rose-50 text-rose-700'
  }
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="space-y-2.5">
      {users.map((user) => (
        <Card
          key={user.id}
          className="border-border/80 bg-card/78 py-0 shadow-sm hover:border-border hover:shadow-md"
        >
          <CardContent className="px-0">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
                      statusClassName(user.status)
                    )}
                  >
                    {user.status.toLowerCase()}
                  </span>
                  <div className="flex min-w-0 flex-wrap gap-1.5">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-md border border-border/70 bg-background/80 px-2 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-md border border-border/70 bg-background/80 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        No roles
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-medium text-foreground">
                    <Link
                      to={`/app/users/${user.id}`}
                      className="transition-colors duration-200 hover:text-primary"
                    >
                      {user.fullName}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center">
                <Link
                  to={`/app/users/${user.id}`}
                  className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  View details
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

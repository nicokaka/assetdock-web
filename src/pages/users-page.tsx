import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { UsersList } from '@/features/users/components/users-list'
import { useUsersListQuery } from '@/features/users/hooks/use-users'

export function UsersPage() {
  const usersQuery = useUsersListQuery()

  return (
    <section className="space-y-6">
      <PageHeader
        title="Users"
        description="Review the users visible to the current session."
        action={
          <Button asChild variant="outline">
          <Link to="/app/users/new">New User</Link>
          </Button>
        }
      />

      {usersQuery.isPending ? (
        <TableSkeleton columns={4} />
      ) : null}

      {usersQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unable to load users</CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isSuccess && usersQuery.data.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">No users found</CardTitle>
            <CardDescription>
              Create the first user when this workspace is ready to grow.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isSuccess && usersQuery.data.length > 0 ? (
        <UsersList users={usersQuery.data} />
      ) : null}
    </section>
  )
}

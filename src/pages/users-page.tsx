import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersList } from '@/features/users/components/users-list'
import { useUsersListQuery } from '@/features/users/hooks/use-users'

export function UsersPage() {
  const usersQuery = useUsersListQuery()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Review the users visible to the current session.
        </p>
      </header>

      {usersQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Loading users</CardTitle>
            <CardDescription>
              Fetching the current user list.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unable to load users</CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isSuccess && usersQuery.data.length === 0 ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">No users found</CardTitle>
            <CardDescription>
              Users will appear here once they are available for the current session.
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

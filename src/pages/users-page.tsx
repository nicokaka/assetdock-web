import { useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { UsersList } from '@/features/users/components/users-list'
import { useUsersListQuery } from '@/features/users/hooks/use-users'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'

export function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const usersQuery = useUsersListQuery({
    page,
    size: 20,
    search: search || undefined,
  })

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

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          placeholder="Search users by name or email..."
        />
      </div>

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

      {usersQuery.isSuccess && usersQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">No users found</CardTitle>
            <CardDescription>
              {search 
                ? 'No users match your search query.' 
                : 'Create the first user when this workspace is ready to grow.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isSuccess && usersQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <UsersList users={usersQuery.data.items} />
          <PaginationControls
            page={usersQuery.data.page}
            totalPages={usersQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </section>
  )
}

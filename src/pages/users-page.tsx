import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { UsersList } from '@/features/users/components/users-list'
import { useUsersListQuery } from '@/features/users/hooks/use-users'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'

export function UsersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { t } = useTranslation()

  const usersQuery = useUsersListQuery({
    page,
    size: 20,
    search: search || undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('app.users.title', 'Users')}
        description={t('app.users.description', 'Manage the users that have access to the dashboard.')}
        action={
          <Button variant="outline" onClick={() => navigate('/app/users/new')}>
            {t('app.users.newUser', 'New User')}
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
          placeholder={t('app.users.searchPlaceholder', 'Search users by name or email...')}
        />
      </div>

      {usersQuery.isPending ? (
        <TableSkeleton columns={4} />
      ) : null}

      {usersQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.users.errorTitle', 'Unable to load users')}</CardTitle>
            <CardDescription>
              {t('app.users.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {usersQuery.isSuccess && usersQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.users.emptyTitle', 'No users found')}</CardTitle>
            <CardDescription>
              {search 
                ? t('app.users.emptyDescriptionFilters', 'No users match your search query.') 
                : t('app.users.emptyDescriptionStart', 'Create the first user when this workspace is ready to grow.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/app/users/new')}>
              {t('app.users.newUser', 'New User')}
            </Button>
          </CardContent>
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

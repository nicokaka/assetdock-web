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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userRoleLabels, userStatusLabels } from '@/features/users/constants/labels'
import { useDebounce } from '@/hooks/use-debounce'
import { usePageTitle } from '@/hooks/use-page-title'

export function UsersPage() {
  usePageTitle(useTranslation().t('app.header.users', 'Users'))
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [role, setRole] = useState<string>('all')
  const debouncedSearch = useDebounce(search, 400)
  const { t } = useTranslation()

  const usersQuery = useUsersListQuery({
    page,
    size: 20,
    search: debouncedSearch || undefined,
    status: status !== 'all' ? status : undefined,
    role: role !== 'all' ? role : undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title={usersQuery.data ? `${t('app.users.title', 'Users')} (${usersQuery.data.totalItems})` : t('app.users.title', 'Users')}
        description={t('app.users.description', 'Manage the users that have access to the dashboard.')}
        action={
          <Button variant="default" onClick={() => navigate('/app/users/new')}>
            {t('app.users.newUser', 'New User')}
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          placeholder={t('app.users.searchPlaceholder', 'Search users by name or email...')}
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t('app.users.allStatuses', 'All Statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.users.allStatuses', 'All Statuses')}</SelectItem>
            {Object.entries(userStatusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {t(`app.users.status.${key}`, label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={role}
          onValueChange={(val) => {
            setRole(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t('app.users.allRoles', 'All Roles')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.users.allRoles', 'All Roles')}</SelectItem>
            {Object.entries(userRoleLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {t(`app.users.role.${key}`, label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              {search || status !== 'all' || role !== 'all'
                ? t('app.users.emptyDescriptionFilters', 'No users match your filters.') 
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

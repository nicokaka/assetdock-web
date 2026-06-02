import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { PeopleList } from '@/features/people/components/people-list'
import { usePeopleListQuery } from '@/features/people/hooks/use-people'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/use-debounce'
import { usePageTitle } from '@/hooks/use-page-title'

export function PeoplePage() {
  usePageTitle(useTranslation().t('app.header.people', 'People'))
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const debouncedSearch = useDebounce(search, 400)
  const { t } = useTranslation()

  const peopleQuery = usePeopleListQuery({
    page,
    size: 20,
    search: debouncedSearch || undefined,
    active: status === 'active' ? true : status === 'inactive' ? false : undefined,
  })

  return (
    <section className="space-y-6">
      <PageHeader
        title={peopleQuery.data ? `${t('app.people.title', 'People')} (${peopleQuery.data.totalItems})` : t('app.people.title', 'People')}
        description={t('app.people.description', 'Manage the people/employees to whom you assign assets.')}
        action={
          <Button variant="default" onClick={() => navigate('/app/people/new')}>
            {t('app.people.newPerson', 'New Person')}
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
          placeholder={t('app.people.searchPlaceholder', 'Search people by name or email...')}
        />
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t('app.people.allStatuses', 'All Statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('app.people.allStatuses', 'All Statuses')}</SelectItem>
            <SelectItem value="active">{t('personForm.status.active', 'Active')}</SelectItem>
            <SelectItem value="inactive">{t('personForm.status.inactive', 'Inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {peopleQuery.isPending ? (
        <TableSkeleton columns={4} />
      ) : null}

      {peopleQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.people.errorTitle', 'Unable to load people')}</CardTitle>
            <CardDescription>
              {t('app.people.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {peopleQuery.isSuccess && peopleQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('app.people.emptyTitle', 'No people found')}</CardTitle>
            <CardDescription>
              {search || status !== 'all'
                ? t('app.people.emptyDescriptionFilters', 'No people match your filters.') 
                : t('app.people.emptyDescriptionStart', 'Create the first person to begin assigning computers.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/app/people/new')}>
              {t('app.people.newPerson', 'New Person')}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {peopleQuery.isSuccess && peopleQuery.data.items.length > 0 ? (
        <div className="space-y-4">
          <PeopleList people={peopleQuery.data.items} />
          <PaginationControls
            page={peopleQuery.data.page}
            totalPages={peopleQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </section>
  )
}

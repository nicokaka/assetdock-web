import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { AuditLogList } from '@/features/audit/components/audit-log-list'
import { useAuditLogsQuery } from '@/features/audit/hooks/use-audit-logs'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const EVENT_TYPE_OPTIONS = [
  'USER_LOGIN',
  'USER_LOGOUT',
  'USER_CREATED',
  'USER_UPDATED',
  'ASSET_CREATED',
  'ASSET_UPDATED',
  'ASSET_STATUS_CHANGED',
  'ASSET_ARCHIVED',
  'ASSET_ASSIGNED',
  'ASSET_UNASSIGNED',
  'IMPORT_STARTED',
  'IMPORT_COMPLETED',
  'IMPORT_FAILED',
] as const

export function AuditLogsPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [eventType, setEventType] = useState<string>('all')
  const [actorSearch, setActorSearch] = useState('')

  const auditLogsQuery = useAuditLogsQuery({
    page,
    size: 20,
    eventType: eventType !== 'all' ? eventType : undefined,
  })

  function handleEventTypeChange(val: string) {
    setEventType(val)
    setPage(1)
  }

  function handleActorSearch(val: string) {
    setActorSearch(val)
    setPage(1)
  }

  const filteredItems = auditLogsQuery.data?.items.filter((item) => {
    if (!actorSearch) return true
    return item.actorUserId?.toLowerCase().includes(actorSearch.toLowerCase()) ?? false
  }) ?? []

  return (
    <section className="space-y-6">
      <PageHeader
        title={
          auditLogsQuery.data
            ? `${t('audit.title', 'Audit Logs')} (${auditLogsQuery.data.totalElements})`
            : t('audit.title', 'Audit Logs')
        }
        description={t('audit.description', 'Review recent security and operational events visible to the current session.')}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={actorSearch}
          onChange={handleActorSearch}
          placeholder={t('audit.searchPlaceholder', 'Filter by actor ID...')}
        />
        <Select value={eventType} onValueChange={handleEventTypeChange}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder={t('audit.allEventTypes', 'All event types')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('audit.allEventTypes', 'All event types')}</SelectItem>
            {EVENT_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {type
                  .toLowerCase()
                  .split('_')
                  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                  .join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {auditLogsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : null}

      {auditLogsQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('audit.errorTitle', 'Unable to load audit logs right now.')}
          </CardContent>
        </Card>
      ) : null}

      {auditLogsQuery.isSuccess && filteredItems.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('audit.emptyTitle', 'No audit logs found')}</CardTitle>
            <CardDescription>
              {actorSearch || eventType !== 'all'
                ? t('audit.emptyFilters', 'No entries match the current filters.')
                : t('audit.emptyDescription', 'Audit entries will appear here when activity becomes available for this session.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {auditLogsQuery.isSuccess && filteredItems.length > 0 ? (
        <div className="space-y-4">
          <AuditLogList items={filteredItems} />
          {auditLogsQuery.data.totalPages > 1 ? (
            <PaginationControls
              page={auditLogsQuery.data.page}
              totalPages={auditLogsQuery.data.totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

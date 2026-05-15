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
import { usePageTitle } from '@/hooks/use-page-title'

// M-6: Keep in sync with backend AuditEventType enum (all 27 values).
const EVENT_TYPE_OPTIONS = [
  // Auth & Session
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'WEB_SESSION_CREATED',
  'WEB_SESSION_LOGGED_OUT',
  'WEB_SESSION_EXPIRED',
  // Users
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DISABLED',
  'USER_LOCKED',
  'USER_UNLOCKED',
  'USER_REACTIVATED',
  'USER_ROLES_UPDATED',
  'PASSWORD_RESET_BY_ADMIN',
  // Assets
  'ASSET_CREATED',
  'ASSET_UPDATED',
  'ASSET_ARCHIVED',
  'ASSET_ASSIGNED',
  'ASSET_UNASSIGNED',
  'ASSET_CHECKED_OUT',
  'ASSET_CHECKED_IN',
  // Catalog
  'CATEGORY_CREATED',
  'CATEGORY_UPDATED',
  'MANUFACTURER_CREATED',
  'MANUFACTURER_UPDATED',
  'LOCATION_CREATED',
  'LOCATION_UPDATED',
  // Imports & System
  'CSV_IMPORT_STARTED',
  'CSV_IMPORT_COMPLETED',
  'CSV_IMPORT_FAILED',
  'SYSTEM_SETUP_COMPLETED',
] as const

export function AuditLogsPage() {
  usePageTitle(useTranslation().t('audit.title', 'Audit Logs'))
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [eventType, setEventType] = useState<string>('all')
  // M-8: Actor search sends a UUID to the backend — client-side filtering was page-scoped only.
  const [actorSearch, setActorSearch] = useState('')

  // Only send actorUserId if the input looks like a valid UUID to avoid 400 errors.
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const actorUserId = actorSearch && uuidRegex.test(actorSearch.trim()) ? actorSearch.trim() : undefined

  const auditLogsQuery = useAuditLogsQuery({
    page,
    size: 20,
    eventType: eventType !== 'all' ? eventType : undefined,
    actorUserId,
  })

  function handleEventTypeChange(val: string) {
    setEventType(val)
    setPage(1)
  }

  function handleActorSearch(val: string) {
    setActorSearch(val)
    setPage(1)
  }

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

      {auditLogsQuery.isSuccess && (auditLogsQuery.data?.items ?? []).length === 0 ? (
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

      {auditLogsQuery.isSuccess && (auditLogsQuery.data?.items ?? []).length > 0 ? (
        <div className="space-y-4">
          <AuditLogList items={auditLogsQuery.data.items} />
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

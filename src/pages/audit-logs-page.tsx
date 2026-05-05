import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { AuditLogList } from '@/features/audit/components/audit-log-list'
import { useAuditLogsQuery } from '@/features/audit/hooks/use-audit-logs'

export function AuditLogsPage() {
  const { t } = useTranslation()
  const auditLogsQuery = useAuditLogsQuery()

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('audit.title', 'Audit Logs')}
        description={t('audit.description', 'Review recent security and operational events visible to the current session.')}
      />

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

      {auditLogsQuery.isSuccess && auditLogsQuery.data.items.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('audit.emptyTitle', 'No audit logs found')}</CardTitle>
            <CardDescription>
              {t('audit.emptyDescription', 'Audit entries will appear here when activity becomes available for this session.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {auditLogsQuery.isSuccess && auditLogsQuery.data.items.length > 0 ? (
        <AuditLogList items={auditLogsQuery.data.items} />
      ) : null}
    </section>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuditLogList } from '@/features/audit/components/audit-log-list'
import { useAuditLogsQuery } from '@/features/audit/hooks/use-audit-logs'

export function AuditLogsPage() {
  const auditLogsQuery = useAuditLogsQuery()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          A simple read-only view of recent security and operational events.
        </p>
      </header>

      {auditLogsQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading audit logs...
          </CardContent>
        </Card>
      ) : null}

      {auditLogsQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Unable to load audit logs right now.
          </CardContent>
        </Card>
      ) : null}

      {auditLogsQuery.isSuccess && auditLogsQuery.data.items.length === 0 ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">No audit logs found</CardTitle>
            <CardDescription>
              Audit entries will appear here when the backend returns results for the
              current session.
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

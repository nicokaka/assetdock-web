import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AuditLogItem } from '@/features/audit/types/audit-log'

type AuditLogListProps = {
  items: AuditLogItem[]
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatTarget(item: AuditLogItem) {
  if (!item.resourceType && !item.resourceId) {
    return 'Not available'
  }

  if (!item.resourceId) {
    return item.resourceType
  }

  return `${item.resourceType ?? 'Resource'} · ${item.resourceId}`
}

function formatEventType(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function AuditLogList({ items }: AuditLogListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="border-border shadow-none">
          <CardHeader className="gap-1">
            <CardTitle className="text-base font-medium">
              {formatEventType(item.eventType)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatTimestamp(item.occurredAt)}
            </p>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div>Actor: {item.actorUserId ?? 'System'}</div>
            <div>Outcome: {item.outcome ?? 'Not available'}</div>
            <div className="sm:col-span-2">Target: {formatTarget(item)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

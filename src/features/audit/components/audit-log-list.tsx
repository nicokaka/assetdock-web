import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    return '—'
  }

  if (!item.resourceId) {
    return item.resourceType
  }

  const shortId = item.resourceId.length > 8
    ? `${item.resourceId.slice(0, 8)}…`
    : item.resourceId

  return `${item.resourceType ?? 'Resource'} · ${shortId}`
}

function formatEventType(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatActor(value: AuditLogItem['actorUserId']) {
  if (!value) {
    return 'System'
  }

  return `${value.slice(0, 8)}…`
}

function outcomeVariant(value: AuditLogItem['outcome']) {
  if (value === 'SUCCESS') {
    return 'success' as const
  }

  if (value === 'FAILURE') {
    return 'danger' as const
  }

  return 'muted' as const
}

export function AuditLogList({ items }: AuditLogListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatTimestamp(item.occurredAt)}
            </TableCell>
            <TableCell className="font-medium">
              {formatEventType(item.eventType)}
            </TableCell>
            <TableCell>
              <Badge variant={outcomeVariant(item.outcome)}>
                {(item.outcome ?? 'unknown').toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {formatActor(item.actorUserId)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatTarget(item)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

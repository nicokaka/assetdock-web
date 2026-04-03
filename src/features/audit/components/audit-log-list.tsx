import { Card, CardContent } from '@/components/ui/card'
import type { AuditLogItem } from '@/features/audit/types/audit-log'
import { cn } from '@/lib/utils'

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

function formatActor(value: AuditLogItem['actorUserId']) {
  return value ? `User · ${value}` : 'System'
}

function outcomeClassName(value: AuditLogItem['outcome']) {
  if (value === 'SUCCESS') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (value === 'FAILURE') {
    return 'border-rose-200 bg-rose-50 text-rose-700'
  }

  return 'border-border/70 bg-background/80 text-muted-foreground'
}

export function AuditLogList({ items }: AuditLogListProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <Card
          key={item.id}
          className="border-border/80 bg-card/78 py-0 shadow-sm hover:border-border hover:shadow-md"
        >
          <CardContent className="px-0">
            <div className="space-y-3 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-base font-medium text-foreground">
                  {formatEventType(item.eventType)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {formatTimestamp(item.occurredAt)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
                      outcomeClassName(item.outcome)
                    )}
                  >
                    {(item.outcome ?? 'UNKNOWN').toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    Actor
                  </span>
                  <span className="mt-1 block text-sm text-foreground">{formatActor(item.actorUserId)}</span>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    Target
                  </span>
                  <span className="mt-1 block text-sm text-foreground">{formatTarget(item)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

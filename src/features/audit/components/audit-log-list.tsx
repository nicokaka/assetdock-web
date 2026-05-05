import { useTranslation } from 'react-i18next'

import React from 'react'
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

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
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

export const AuditLogList = React.memo(function AuditLogList({ items }: AuditLogListProps) {
  const { t, i18n } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('audit.table.date', 'Time')}</TableHead>
          <TableHead>{t('audit.table.event', 'Event')}</TableHead>
          <TableHead>{t('audit.table.outcome', 'Outcome')}</TableHead>
          <TableHead>{t('audit.table.actor', 'Actor')}</TableHead>
          <TableHead>{t('audit.table.target', 'Target')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatTimestamp(item.occurredAt, i18n.language)}
            </TableCell>
            <TableCell className="font-medium">
              {t(`app.overview.events.${item.eventType}`, formatEventType(item.eventType))}
            </TableCell>
            <TableCell>
              <Badge variant={outcomeVariant(item.outcome)}>
                {t(`audit.outcome.${item.outcome?.toLowerCase() ?? 'unknown'}`, (item.outcome ?? 'unknown').toLowerCase())}
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
})

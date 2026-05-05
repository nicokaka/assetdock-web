import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ImportJob } from '@/features/imports/types/import-job'

type ImportJobSummaryProps = {
  job: ImportJob
}

function formatTimestamp(value: string | null, locale: string) {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function statusVariant(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'success' as const
    case 'FAILED':
      return 'danger' as const
    case 'PROCESSING':
      return 'info' as const
    case 'PENDING':
      return 'warning' as const
    default:
      return 'muted' as const
  }
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export function ImportJobSummary({ job }: ImportJobSummaryProps) {
  const { t, i18n } = useTranslation()

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-medium">{job.fileName}</CardTitle>
          <Badge variant={statusVariant(job.status)}>
            {t(`imports.table.statusVariant.${job.status.toLowerCase()}`, statusLabel(job.status))}
          </Badge>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {job.id.slice(0, 8)}…
        </p>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div>{t('imports.table.date', 'Created')}: {formatTimestamp(job.createdAt, i18n.language)}</div>
        <div>
          {t('imports.table.progress', 'Progress')}: {job.processedRows} / {job.totalRows}
        </div>
        <div>
          {t('imports.table.result', 'Result')}: {t('imports.table.resultSucceeded', '{{count}} succeeded', { count: job.successCount })}, {t('imports.table.resultFailed', '{{count}} failed', { count: job.errorCount })}
        </div>
        {job.failureReason ? (
          <div className="sm:col-span-2 text-destructive">
            {t('imports.table.failureReason', 'Failure')}: {job.failureReason}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

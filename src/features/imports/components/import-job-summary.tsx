import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ImportJob } from '@/features/imports/types/import-job'

type ImportJobSummaryProps = {
  job: ImportJob
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ImportJobSummary({ job }: ImportJobSummaryProps) {
  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-base font-medium">{job.fileName}</CardTitle>
        <p className="text-sm text-muted-foreground">Job {job.id}</p>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div>Status: {job.status}</div>
        <div>Created: {formatTimestamp(job.createdAt)}</div>
        <div>
          Progress: {job.processedRows} / {job.totalRows}
        </div>
        <div>
          Result: {job.successCount} succeeded, {job.errorCount} failed
        </div>
        {job.failureReason ? (
          <div className="sm:col-span-2">Failure: {job.failureReason}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

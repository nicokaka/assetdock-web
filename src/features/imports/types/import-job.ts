export type ImportJobStatus =
  | 'PROCESSING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'

export type ImportJobError = {
  line: number
  reason: string
}

export type ImportJob = {
  id: string
  status: ImportJobStatus
  fileName: string
  totalRows: number
  processedRows: number
  successCount: number
  errorCount: number
  errors: ImportJobError[]
  failureReason: string | null
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
}

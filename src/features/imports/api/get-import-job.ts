import type { ImportJob } from '@/features/imports/types/import-job'
import { httpClient } from '@/lib/http-client'

export async function getImportJob(jobId: string) {
  return httpClient.request<ImportJob>(`/imports/assets/${jobId}`)
}

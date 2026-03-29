import type { ImportJob } from '@/features/imports/types/import-job'
import { httpClient } from '@/lib/http-client'

export async function importAssetsCsv(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return httpClient.request<ImportJob>('/imports/assets/csv', {
    method: 'POST',
    body: formData,
  })
}

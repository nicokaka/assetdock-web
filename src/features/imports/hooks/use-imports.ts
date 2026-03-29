import { useMutation, useQuery } from '@tanstack/react-query'

import { getImportJob } from '@/features/imports/api/get-import-job'
import { importAssetsCsv } from '@/features/imports/api/import-assets-csv'

export function useImportAssetsCsvMutation() {
  return useMutation({
    mutationFn: (file: File) => importAssetsCsv(file),
  })
}

export function useImportJobQuery(jobId: string | null) {
  return useQuery({
    queryKey: ['import-job', jobId],
    queryFn: () => getImportJob(jobId!),
    enabled: false,
  })
}

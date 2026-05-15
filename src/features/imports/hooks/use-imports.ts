import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { getImportJob } from '@/features/imports/api/get-import-job'
import { importAssetsCsv } from '@/features/imports/api/import-assets-csv'

export function useImportAssetsCsvMutation() {
  // M-7: Use i18n instead of hardcoded strings.
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (file: File) => importAssetsCsv(file),
    onSuccess: () => {
      toast.success(t('toast.import.uploadSuccess', 'File uploaded. Import started.'))
    },
    onError: () => {
      toast.error(t('toast.import.uploadError', 'Failed to upload file. Check the file format and try again.'))
    },
  })
}

export function useImportJobQuery(jobId: string | null) {
  return useQuery({
    queryKey: ['import-job', jobId],
    queryFn: () => getImportJob(jobId!),
    // L-7: Fixed — enabled when jobId is present, not hardcoded false.
    enabled: !!jobId,
  })
}

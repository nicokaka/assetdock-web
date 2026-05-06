import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { createAsset } from '@/features/assets/api/create-asset'
import type { CreateAssetInput } from '@/features/assets/types/asset'

export function useCreateAssetMutation() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: CreateAssetInput) => createAsset(input),
    onSuccess: (asset) => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success(t('toast.asset.createSuccess', 'Asset created successfully'))
    },
    onError: () => {
      toast.error(t('toast.asset.createError', 'Failed to create asset'))
    },
  })
}

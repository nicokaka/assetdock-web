import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createAsset } from '@/features/assets/api/create-asset'
import type { CreateAssetInput } from '@/features/assets/types/asset'

export function useCreateAssetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAssetInput) => createAsset(input),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset created successfully')
    },
    onError: () => {
      toast.error('Failed to create asset')
    },
  })
}

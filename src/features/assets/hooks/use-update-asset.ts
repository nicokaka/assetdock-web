import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateAsset } from '@/features/assets/api/update-asset'
import type { CreateAssetInput } from '@/features/assets/types/asset'

export function useUpdateAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAssetInput) => updateAsset(assetId, input),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
    },
  })
}

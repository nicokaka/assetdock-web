import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateAsset } from '@/features/assets/api/update-asset'
import type { UpdateAssetInput } from '@/features/assets/types/asset'

export function useUpdateAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateAssetInput) => updateAsset(assetId, input),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset updated successfully')
    },
    onError: () => {
      toast.error('Failed to update asset')
    },
  })
}

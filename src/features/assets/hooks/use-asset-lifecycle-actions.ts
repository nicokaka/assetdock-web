import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { archiveAsset } from '@/features/assets/api/archive-asset'
import { updateAssetStatus } from '@/features/assets/api/update-asset-status'
import type { AssetStatus } from '@/features/assets/types/asset'

export function useUpdateAssetStatusMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: AssetStatus) => updateAssetStatus(assetId, { status }),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset status updated')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })
}

export function useArchiveAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => archiveAsset(assetId),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset archived')
    },
    onError: () => {
      toast.error('Failed to archive asset')
    },
  })
}

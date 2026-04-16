import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { archiveAsset } from '@/features/assets/api/archive-asset'
import { updateAssetStatus } from '@/features/assets/api/update-asset-status'
import type { AssetDetail, AssetStatus } from '@/features/assets/types/asset'

export function useUpdateAssetStatusMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: AssetStatus) => updateAssetStatus(assetId, { status }),

    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['assets', assetId] })

      const previousAsset = queryClient.getQueryData<AssetDetail>(['assets', assetId])

      if (previousAsset) {
        queryClient.setQueryData<AssetDetail>(['assets', assetId], {
          ...previousAsset,
          status: newStatus,
        })
      }

      return { previousAsset }
    },

    onError: (_err, _newStatus, context) => {
      if (context?.previousAsset) {
        queryClient.setQueryData(['assets', assetId], context.previousAsset)
      }
      toast.error('Failed to update status')
    },

    onSuccess: (asset) => {
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset status updated')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useArchiveAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => archiveAsset(assetId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['assets', assetId] })

      const previousAsset = queryClient.getQueryData<AssetDetail>(['assets', assetId])

      if (previousAsset) {
        queryClient.setQueryData<AssetDetail>(['assets', assetId], {
          ...previousAsset,
          archivedAt: new Date().toISOString(),
        })
      }

      return { previousAsset }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousAsset) {
        queryClient.setQueryData(['assets', assetId], context.previousAsset)
      }
      toast.error('Failed to archive asset')
    },

    onSuccess: (asset) => {
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success('Asset archived')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

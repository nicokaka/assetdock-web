import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { archiveAsset } from '@/features/assets/api/archive-asset'
import { updateAssetStatus } from '@/features/assets/api/update-asset-status'
import type { AssetDetail, AssetStatus } from '@/features/assets/types/asset'

export function useUpdateAssetStatusMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

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
      toast.error(t('toast.asset.statusError', 'Failed to update status'))
    },

    onSuccess: (asset) => {
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success(t('toast.asset.statusSuccess', 'Asset status updated'))
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useArchiveAssetMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

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
      toast.error(t('toast.asset.archiveError', 'Failed to archive asset'))
    },

    onSuccess: (asset) => {
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success(t('toast.asset.archiveSuccess', 'Asset archived'))
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

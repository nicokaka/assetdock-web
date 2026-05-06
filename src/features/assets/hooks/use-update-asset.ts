import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { updateAsset } from '@/features/assets/api/update-asset'
import type { AssetDetail, UpdateAssetInput } from '@/features/assets/types/asset'

export function useUpdateAssetMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: UpdateAssetInput) => updateAsset(assetId, input),

    onMutate: async (input) => {
      // Cancel any in-flight refetches to avoid overwriting the optimistic value.
      await queryClient.cancelQueries({ queryKey: ['assets', assetId] })

      // Snapshot current state for rollback on error.
      const previousAsset = queryClient.getQueryData<AssetDetail>(['assets', assetId])

      // Apply optimistic update immediately.
      if (previousAsset) {
        queryClient.setQueryData<AssetDetail>(['assets', assetId], {
          ...previousAsset,
          ...input,
        })
      }

      return { previousAsset }
    },

    onError: (_err, _input, context) => {
      // Rollback to the snapshot captured in onMutate.
      if (context?.previousAsset) {
        queryClient.setQueryData(['assets', assetId], context.previousAsset)
      }
      toast.error(t('toast.asset.updateError', 'Failed to update asset'))
    },

    onSuccess: (asset) => {
      // Replace optimistic value with authoritative server response.
      queryClient.setQueryData(['assets', asset.id], asset)
      toast.success(t('toast.asset.updateSuccess', 'Asset updated successfully'))
    },

    onSettled: () => {
      // Revalidate list and detail regardless of success/failure.
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

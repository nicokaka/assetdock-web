import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { httpClient } from '@/lib/http-client'

export function useCheckoutMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: { personId: string; expectedReturnDate?: string; notes?: string }) => {
      const response = await httpClient.request<unknown>(`/assets/${assetId}/checkout`, {
        method: 'POST',
        body: data
      })
      return response
    },
    onSuccess: () => {
      // A-3: Fixed key — was ['asset', assetId] (singular), must match useAssetDetailQuery ['assets', assetId]
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-checkouts', assetId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      // A-2: Success feedback consistent with the rest of the app.
      toast.success(t('app.checkout.successToast', 'Asset checked out successfully'))
    },
  })
}

export function useCheckinMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: { notes?: string }) => {
      const response = await httpClient.request<unknown>(`/assets/${assetId}/checkin`, {
        method: 'POST',
        body: data
      })
      return response
    },
    onSuccess: () => {
      // A-3: Fixed key — was ['asset', assetId] (singular), must match useAssetDetailQuery ['assets', assetId]
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-checkouts', assetId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      // A-2: Success feedback consistent with the rest of the app.
      toast.success(t('app.checkin.successToast', 'Asset checked in successfully'))
    },
  })
}

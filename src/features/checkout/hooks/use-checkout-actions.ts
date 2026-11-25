import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { httpClient } from '@/lib/http-client'

export type AssetCheckout = {
  id: string
  assetId: string
  personId: string
  checkedOutAt: string
  expectedReturnDate: string | null
  checkedInAt: string | null
  checkedOutBy: string
  checkedInBy: string | null
  notes: string | null
}

export type CheckoutMutationInput = {
  assetId?: string
  personId: string
  expectedReturnDate?: string
  notes?: string
}

export function useAssetCheckoutsQuery(assetId: string) {
  return useQuery({
    queryKey: ['asset-checkouts', assetId],
    queryFn: () => httpClient.request<AssetCheckout[]>(`/assets/${assetId}/checkouts`),
    enabled: Boolean(assetId),
  })
}

export function useCheckoutMutation(fixedAssetId?: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: CheckoutMutationInput) => {
      const targetAssetId = data.assetId ?? fixedAssetId
      if (!targetAssetId) {
        throw new Error('Asset ID is required for checkout.')
      }

      return httpClient.request<AssetCheckout>(`/assets/${targetAssetId}/checkout`, {
        method: 'POST',
        body: {
          personId: data.personId,
          expectedReturnDate: data.expectedReturnDate,
          notes: data.notes,
        },
      })
    },
    onSuccess: (_result, variables) => {
      const targetAssetId = variables.assetId ?? fixedAssetId
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
      if (targetAssetId) {
        void queryClient.invalidateQueries({ queryKey: ['assets', targetAssetId] })
        void queryClient.invalidateQueries({ queryKey: ['asset-checkouts', targetAssetId] })
        void queryClient.invalidateQueries({ queryKey: ['asset-timeline', targetAssetId] })
      }
      void queryClient.invalidateQueries({ queryKey: ['people', 'history'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      toast.success(t('app.checkout.successToast', 'Asset assigned successfully'))
    },
  })
}

export function useCheckinMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: { notes?: string }) => {
      return httpClient.request<AssetCheckout>(`/assets/${assetId}/checkin`, {
        method: 'POST',
        body: data,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
      void queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      void queryClient.invalidateQueries({ queryKey: ['asset-checkouts', assetId] })
      void queryClient.invalidateQueries({ queryKey: ['asset-timeline', assetId] })
      void queryClient.invalidateQueries({ queryKey: ['people', 'history'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
      toast.success(t('app.checkin.successToast', 'Asset returned to stock'))
    },
  })
}

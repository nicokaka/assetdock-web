import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export function useCheckoutMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { userId: string; expectedReturnDate?: string; notes?: string }) => {
      const response = await httpClient.request<any>(`/assets/${assetId}/checkout`, {
        method: 'POST',
        body: data
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-checkouts', assetId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useCheckinMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { notes?: string }) => {
      const response = await httpClient.request<any>(`/assets/${assetId}/checkin`, {
        method: 'POST',
        body: data
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-checkouts', assetId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

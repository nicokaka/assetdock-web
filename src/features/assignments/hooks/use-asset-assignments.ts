import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { assignAsset } from '@/features/assignments/api/assign-asset'
import { listAssetAssignments } from '@/features/assignments/api/list-asset-assignments'
import { unassignAsset } from '@/features/assignments/api/unassign-asset'
import type { AssignAssetInput } from '@/features/assignments/types/assignment'

export function useAssetAssignmentsQuery(assetId: string) {
  return useQuery({
    queryKey: ['assets', assetId, 'assignments'],
    queryFn: () => listAssetAssignments(assetId),
    enabled: Boolean(assetId),
  })
}

export function useAssignAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignAssetInput) => assignAsset(assetId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'assignments'] })
    },
  })
}

export function useUnassignAssetMutation(assetId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => unassignAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'assignments'] })
    },
  })
}

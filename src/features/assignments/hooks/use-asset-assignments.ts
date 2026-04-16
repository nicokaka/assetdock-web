import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      toast.success('Asset assigned successfully')
    },
    onError: () => {
      toast.error('Failed to assign asset')
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
      toast.success('Asset unassigned')
    },
    onError: () => {
      toast.error('Failed to unassign asset')
    },
  })
}

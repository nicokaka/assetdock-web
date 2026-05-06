import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: AssignAssetInput) => assignAsset(assetId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
      void queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      void queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'assignments'] })
      toast.success(t('toast.assignment.assignSuccess', 'Asset assigned successfully'))
    },
    onError: () => {
      toast.error(t('toast.assignment.assignError', 'Failed to assign asset'))
    },
  })
}

export function useUnassignAssetMutation(assetId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: () => unassignAsset(assetId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assets'] })
      void queryClient.invalidateQueries({ queryKey: ['assets', assetId] })
      void queryClient.invalidateQueries({ queryKey: ['assets', assetId, 'assignments'] })
      toast.success(t('toast.assignment.unassignSuccess', 'Asset unassigned'))
    },
    onError: () => {
      toast.error(t('toast.assignment.unassignError', 'Failed to unassign asset'))
    },
  })
}

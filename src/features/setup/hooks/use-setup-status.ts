import { useQuery } from '@tanstack/react-query'

import { getSetupStatus } from '@/features/setup/api/setup-api'

export const setupStatusQueryKey = ['setup-status'] as const

export function useSetupStatus() {
  return useQuery({
    queryKey: setupStatusQueryKey,
    queryFn: getSetupStatus,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    retry: 1,
  })
}

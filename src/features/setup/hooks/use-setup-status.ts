import { useQuery } from '@tanstack/react-query'

import { getSetupStatus } from '@/features/setup/api/setup-api'

export const setupStatusQueryKey = ['setup-status'] as const

export function useSetupStatus() {
  return useQuery({
    queryKey: setupStatusQueryKey,
    queryFn: getSetupStatus,
    // Never use a stale cache — always re-check on mount.
    // This is a critical gate: we must not serve a cached "configured: false"
    // after the system has already been set up.
    staleTime: 0,
    retry: 1,
  })
}

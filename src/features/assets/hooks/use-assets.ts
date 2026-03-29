import { useQuery } from '@tanstack/react-query'

import { listAssets } from '@/features/assets/api/list-assets'

export function useAssetsQuery() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: listAssets,
  })
}

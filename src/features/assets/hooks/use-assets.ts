import { useQuery } from '@tanstack/react-query'

import { listAssets, type AssetListFilters } from '@/features/assets/api/list-assets'

export function useAssetsQuery(filters?: AssetListFilters) {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: () => listAssets(filters),
  })
}

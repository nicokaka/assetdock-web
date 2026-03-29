import { useQuery } from '@tanstack/react-query'

import { getAsset } from '@/features/assets/api/get-asset'

export function useAssetDetailQuery(assetId: string) {
  return useQuery({
    queryKey: ['assets', assetId],
    queryFn: () => getAsset(assetId),
    enabled: Boolean(assetId),
  })
}

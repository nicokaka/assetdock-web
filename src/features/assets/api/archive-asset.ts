import type { AssetDetail } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export async function archiveAsset(assetId: string) {
  return httpClient.request<AssetDetail>(`/api/v1/assets/${assetId}/archive`, {
    method: 'PATCH',
  })
}

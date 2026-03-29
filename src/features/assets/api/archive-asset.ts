import type { AssetDetail } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export async function archiveAsset(assetId: string) {
  return httpClient.request<AssetDetail>(`/assets/${assetId}/archive`, {
    method: 'PATCH',
  })
}

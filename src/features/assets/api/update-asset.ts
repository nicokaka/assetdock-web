import type { AssetDetail, CreateAssetInput } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export async function updateAsset(assetId: string, input: CreateAssetInput) {
  return httpClient.request<AssetDetail>(`/api/v1/assets/${assetId}`, {
    method: 'PATCH',
    body: input,
  })
}

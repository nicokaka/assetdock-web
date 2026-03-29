import type { AssetDetail, CreateAssetInput } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export async function createAsset(input: CreateAssetInput) {
  return httpClient.request<AssetDetail>('/api/v1/assets', {
    method: 'POST',
    body: input,
  })
}

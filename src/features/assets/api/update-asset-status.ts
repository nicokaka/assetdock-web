import type { AssetDetail, AssetStatus } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

type UpdateAssetStatusInput = {
  status: AssetStatus
}

export async function updateAssetStatus(assetId: string, input: UpdateAssetStatusInput) {
  return httpClient.request<AssetDetail>(`/assets/${assetId}/status`, {
    method: 'PATCH',
    body: input,
  })
}

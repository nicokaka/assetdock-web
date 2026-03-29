import type {
  AssetAssignment,
  AssignAssetInput,
} from '@/features/assignments/types/assignment'
import { httpClient } from '@/lib/http-client'

export async function assignAsset(assetId: string, input: AssignAssetInput) {
  return httpClient.request<AssetAssignment>(`/assets/${assetId}/assignments`, {
    method: 'POST',
    body: input,
  })
}

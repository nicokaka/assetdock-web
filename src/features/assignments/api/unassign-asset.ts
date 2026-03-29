import type { AssetAssignment } from '@/features/assignments/types/assignment'
import { httpClient } from '@/lib/http-client'

export async function unassignAsset(assetId: string) {
  return httpClient.request<AssetAssignment>(`/assets/${assetId}/unassign`, {
    method: 'POST',
  })
}

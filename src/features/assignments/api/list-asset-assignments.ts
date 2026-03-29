import type { AssetAssignment } from '@/features/assignments/types/assignment'
import { httpClient } from '@/lib/http-client'

export async function listAssetAssignments(assetId: string) {
  return httpClient.request<AssetAssignment[]>(`/assets/${assetId}/assignments`)
}

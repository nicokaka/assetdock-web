import type { AssetListItem } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export async function listAssets() {
  return httpClient.request<AssetListItem[]>('/assets')
}

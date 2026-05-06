import type { AssetPageView } from '@/features/assets/types/asset'
import { httpClient } from '@/lib/http-client'

export type AssetListFilters = {
  page?: number
  size?: number
  status?: string
  search?: string
  categoryId?: string
  locationId?: string
}

export async function listAssets(filters?: AssetListFilters) {
  const searchParams = new URLSearchParams()
  if (filters?.page) searchParams.set('page', String(filters.page))
  if (filters?.size) searchParams.set('size', String(filters.size))
  if (filters?.status) searchParams.set('status', filters.status)
  if (filters?.search) searchParams.set('search', filters.search)
  if (filters?.categoryId) searchParams.set('categoryId', filters.categoryId)
  if (filters?.locationId) searchParams.set('locationId', filters.locationId)
  
  const query = searchParams.toString()
  return httpClient.request<AssetPageView>(`/assets${query ? `?${query}` : ''}`)
}

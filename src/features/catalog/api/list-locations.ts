import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function listLocations() {
  return httpClient.request<CatalogOption[]>('/locations')
}

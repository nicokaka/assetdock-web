import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function listManufacturers() {
  return httpClient.request<CatalogOption[]>('/api/v1/manufacturers')
}

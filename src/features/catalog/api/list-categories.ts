import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function listCategories() {
  return httpClient.request<CatalogOption[]>('/categories')
}

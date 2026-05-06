import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function createCategory(name: string, description?: string) {
  return httpClient.request<CatalogOption>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name, description, active: true }),
  })
}

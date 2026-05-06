import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function createLocation(name: string, description?: string) {
  return httpClient.request<CatalogOption>('/locations', {
    method: 'POST',
    body: JSON.stringify({ name, description, active: true }),
  })
}

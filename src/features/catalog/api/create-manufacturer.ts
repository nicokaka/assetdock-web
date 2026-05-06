import type { CatalogOption } from '@/features/catalog/types/catalog'
import { httpClient } from '@/lib/http-client'

export async function createManufacturer(name: string, description?: string) {
  return httpClient.request<CatalogOption>('/manufacturers', {
    method: 'POST',
    body: JSON.stringify({ name, description, active: true }),
  })
}

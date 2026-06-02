import type { PersonCheckout } from '@/features/people/types/person'
import { httpClient } from '@/lib/http-client'

export async function getPersonHistory(personId: string) {
  return httpClient.request<PersonCheckout[]>(`/people/${personId}/checkouts`)
}

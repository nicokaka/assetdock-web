import type { PersonDetail } from '@/features/people/types/person'
import { httpClient } from '@/lib/http-client'

export async function getPerson(id: string) {
  return httpClient.request<PersonDetail>(`/people/${id}`)
}

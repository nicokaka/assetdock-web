import { httpClient } from '@/lib/http-client'

export async function deletePerson(id: string) {
  return httpClient.request<void>(`/people/${id}`, {
    method: 'DELETE',
  })
}

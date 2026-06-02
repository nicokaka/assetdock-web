import type { PersonDetail } from '@/features/people/types/person'
import { httpClient } from '@/lib/http-client'

export type UpdatePersonInput = {
  fullName: string
  email?: string
  department?: string
  active: boolean
}

export async function updatePerson({ id, ...body }: UpdatePersonInput & { id: string }) {
  return httpClient.request<PersonDetail>(`/people/${id}`, {
    method: 'PUT',
    body,
  })
}

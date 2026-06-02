import type { PersonDetail } from '@/features/people/types/person'
import { httpClient } from '@/lib/http-client'

export type CreatePersonInput = {
  fullName: string
  email?: string
  department?: string
  active: boolean
}

export async function createPerson(input: CreatePersonInput) {
  return httpClient.request<PersonDetail>('/people', {
    method: 'POST',
    body: input,
  })
}

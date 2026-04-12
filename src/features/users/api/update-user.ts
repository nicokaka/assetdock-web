import type { UserDetail } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

export type UpdateUserInput = {
  fullName: string
  email: string
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  return httpClient.request<UserDetail>(`/users/${userId}`, {
    method: 'PATCH',
    body: input,
  })
}

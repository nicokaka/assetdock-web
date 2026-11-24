import { httpClient } from '@/lib/http-client'

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  await httpClient.request(`/users/${userId}/password`, {
    method: 'PATCH',
    body: input,
  })
}

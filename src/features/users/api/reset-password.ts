import { httpClient } from '@/lib/http-client'

export interface ResetPasswordInput {
  newPassword: string
}

export async function resetPassword(userId: string, input: ResetPasswordInput): Promise<void> {
  await httpClient.request(`/users/${userId}/reset-password`, {
    method: 'PATCH',
    body: input
  })
}

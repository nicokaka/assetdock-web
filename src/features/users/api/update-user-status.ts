import type { UserDetail, UserStatus } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

type UpdateUserStatusInput = {
  status: UserStatus
}

export async function updateUserStatus(userId: string, input: UpdateUserStatusInput) {
  return httpClient.request<UserDetail>(`/users/${userId}/status`, {
    method: 'PATCH',
    body: input,
  })
}

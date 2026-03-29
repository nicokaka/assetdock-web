import type { UserDetail, UserRole } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

type UpdateUserRolesInput = {
  roles: UserRole[]
}

export async function updateUserRoles(userId: string, input: UpdateUserRolesInput) {
  return httpClient.request<UserDetail>(`/users/${userId}/roles`, {
    method: 'PATCH',
    body: input,
  })
}

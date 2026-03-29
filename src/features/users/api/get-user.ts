import type { UserDetail } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

export async function getUser(userId: string) {
  return httpClient.request<UserDetail>(`/users/${userId}`)
}

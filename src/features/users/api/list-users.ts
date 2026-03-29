import type { UserSummary } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

export async function listUsers() {
  return httpClient.request<UserSummary[]>('/users')
}

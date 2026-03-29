import type { UserDetail } from '@/features/users/types/user'
import type { CreateUserInput } from '@/features/users/types/user-form'
import { httpClient } from '@/lib/http-client'

export async function createUser(input: CreateUserInput) {
  return httpClient.request<UserDetail>('/users', {
    method: 'POST',
    body: input,
  })
}

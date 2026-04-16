import type { UserPageView } from '@/features/users/types/user'
import { httpClient } from '@/lib/http-client'

export type UserListFilters = {
  page?: number
  size?: number
  search?: string
}

export async function listUsers(filters?: UserListFilters) {
  const searchParams = new URLSearchParams()
  if (filters?.page) searchParams.set('page', String(filters.page))
  if (filters?.size) searchParams.set('size', String(filters.size))
  if (filters?.search) searchParams.set('search', filters.search)
  
  const query = searchParams.toString()
  return httpClient.request<UserPageView>(`/users${query ? `?${query}` : ''}`)
}

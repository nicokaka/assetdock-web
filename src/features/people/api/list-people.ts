import type { PersonPageView } from '@/features/people/types/person'
import { httpClient } from '@/lib/http-client'

export type PersonListFilters = {
  page?: number
  size?: number
  search?: string
  active?: boolean
}

export async function listPeople(filters?: PersonListFilters) {
  const searchParams = new URLSearchParams()
  if (filters?.page) searchParams.set('page', String(filters.page))
  if (filters?.size) searchParams.set('size', String(filters.size))
  if (filters?.search) searchParams.set('search', filters.search)
  if (filters?.active !== undefined) searchParams.set('active', String(filters.active))
  
  const query = searchParams.toString()
  return httpClient.request<PersonPageView>(`/people${query ? `?${query}` : ''}`)
}

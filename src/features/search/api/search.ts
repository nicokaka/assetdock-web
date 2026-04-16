import { httpClient } from '@/lib/http-client'
import type { GlobalSearchResult } from '@/features/search/types/search'

export async function searchGlobal(query: string) {
  if (!query || query.length < 2) {
    return { assets: [], users: [] }
  }
  const searchParams = new URLSearchParams()
  searchParams.set('q', query)
  return httpClient.request<GlobalSearchResult>(`/search?${searchParams.toString()}`)
}

import { useQuery } from '@tanstack/react-query'
import { searchGlobal } from '@/features/search/api/search'

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchGlobal(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // Cache search results for 1 minute
  })
}

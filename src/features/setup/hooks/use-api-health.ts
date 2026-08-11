import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export function useApiHealth() {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      try {
        await httpClient.request('/info')
        return true
      } catch {
        return false
      }
    },
    retry: false,
    refetchInterval: 30000,
  })
}

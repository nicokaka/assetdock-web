import { useQuery } from '@tanstack/react-query'

import { httpClient } from '@/lib/http-client'

interface HealthResponse {
  status: string
}

export function useApiHealth() {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      // Use the generic request method since actuator endpoints might not be under /api/v1
      // and we just need a simple GET without necessarily requiring auth (public endpoint)
      try {
        const response = await httpClient.request<HealthResponse>('/actuator/health')
        return response?.status === 'UP'
      } catch {
        return false
      }
    },
    retry: false,
    refetchInterval: 30000, // Check every 30 seconds
  })
}

import { useQuery } from '@tanstack/react-query'

interface HealthResponse {
  status: string
}

const MANAGEMENT_URL = import.meta.env.VITE_MANAGEMENT_URL ?? 'http://localhost:8081'

export function useApiHealth() {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      try {
        const response = await fetch(`${MANAGEMENT_URL}/actuator/health`, {
          credentials: 'omit',
        })
        if (!response.ok) return false
        const data: HealthResponse = await response.json()
        return data?.status === 'UP'
      } catch {
        return false
      }
    },
    retry: false,
    refetchInterval: 30000,
  })
}

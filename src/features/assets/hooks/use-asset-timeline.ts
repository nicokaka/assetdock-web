import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

export interface TimelineEvent {
  id: string
  eventType: string
  actorUserId: string
  occurredAt: string
  details: Record<string, any>
}

export function useAssetTimeline(assetId: string) {
  return useQuery({
    queryKey: ['asset-timeline', assetId],
    queryFn: async () => {
      const response = await httpClient.request<TimelineEvent[]>(`/assets/${assetId}/timeline`)
      return response
    },
  })
}

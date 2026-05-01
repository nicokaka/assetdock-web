import { httpClient } from '@/lib/http-client'
import type { SetupRequest, SetupResponse, SetupStatusResponse } from '@/features/setup/types/setup-types'

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  try {
    return await httpClient.request<SetupStatusResponse>('/api/v1/setup/status')
  } catch {
    // If the backend is unreachable or fails, assume configured
    // to fall back to the normal login flow, avoiding blocking the app.
    return { configured: true }
  }
}

export async function postSetup(data: SetupRequest): Promise<SetupResponse> {
  return httpClient.request<SetupResponse>('/api/v1/setup', {
    method: 'POST',
    body: data,
  })
}

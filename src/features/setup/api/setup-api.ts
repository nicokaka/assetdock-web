import { HttpError, httpClient } from '@/lib/http-client'
import type { SetupRequest, SetupResponse, SetupStatusResponse } from '@/features/setup/types/setup-types'

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  try {
    return await httpClient.request<SetupStatusResponse>('/api/v1/setup/status')
  } catch (error) {
    // If the backend is unreachable, assume configured to avoid blocking the login flow.
    if (error instanceof HttpError) {
      throw error
    }
    throw error
  }
}

export async function postSetup(data: SetupRequest): Promise<SetupResponse> {
  return httpClient.request<SetupResponse>('/api/v1/setup', {
    method: 'POST',
    body: data,
  })
}

import type { LoginInput } from '@/features/auth/schemas/login-schema'
import type { SessionResponse } from '@/features/auth/types/session'
import { HttpError, httpClient } from '@/lib/http-client'

export async function login(credentials: LoginInput) {
  return httpClient.request<SessionResponse>('/api/v1/web/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export async function getSession() {
  try {
    return await httpClient.request<SessionResponse>('/api/v1/web/auth/me')
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return null
    }

    throw error
  }
}

export async function logout() {
  try {
    await httpClient.request<void>('/api/v1/web/auth/logout', {
      method: 'POST',
    })
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return
    }

    throw error
  }
}

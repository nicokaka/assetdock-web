import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSession, login, logout } from '@/features/auth/api/session'
import type { LoginInput } from '@/features/auth/schemas/login-schema'
import { HttpError } from '@/lib/http-client'

const sessionQueryKey = ['session'] as const

export function useSessionQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    staleTime: 60_000,
    enabled: options?.enabled,
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(sessionQueryKey, session)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      window.location.assign('/login')
    },
  })
}

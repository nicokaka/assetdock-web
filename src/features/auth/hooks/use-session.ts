import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSession, login, logout } from '@/features/auth/api/session'
import type { LoginInput } from '@/features/auth/schemas/login-schema'

const sessionQueryKey = ['session'] as const

export function useSessionQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    staleTime: 60_000,
    enabled: options?.enabled,
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

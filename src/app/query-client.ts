import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { HttpError } from '@/lib/http-client'

function handleGlobalError(error: unknown) {
  if (error instanceof HttpError && error.status === 401) {
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError,
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status === 401) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
})

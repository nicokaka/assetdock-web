import { useMutation, useQueryClient } from '@tanstack/react-query'

import { resetPassword, type ResetPasswordInput } from '@/features/users/api/reset-password'

interface UseResetPasswordOptions {
  userId: string
  onSuccess?: () => void
}

export function useResetPassword({ userId, onSuccess }: UseResetPasswordOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(userId, input),
    onSuccess: () => {
      // Invalidate the user details query to reflect any status changes (like unlocking)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      onSuccess?.()
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { changePassword, type ChangePasswordInput } from '@/features/users/api/change-password'

interface UseChangePasswordOptions {
  userId: string
  onSuccess?: () => void
}

export function useChangePassword({ userId, onSuccess }: UseChangePasswordOptions) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(userId, input),
    onSuccess: () => {
      onSuccess?.()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

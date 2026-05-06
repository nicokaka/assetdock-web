import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { createUser } from '@/features/users/api/create-user'
import type { CreateUserInput } from '@/features/users/types/user-form'

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.setQueryData(['users', 'detail', user.id], user)
      toast.success(t('toast.user.createSuccess', 'User created successfully'))
    },
    onError: () => {
      toast.error(t('toast.user.createError', 'Failed to create user'))
    },
  })
}

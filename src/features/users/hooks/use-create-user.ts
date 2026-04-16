import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createUser } from '@/features/users/api/create-user'
import type { CreateUserInput } from '@/features/users/types/user-form'

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.setQueryData(['users', 'detail', user.id], user)
      toast.success('User created successfully')
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })
}

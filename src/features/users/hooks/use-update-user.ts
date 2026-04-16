import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateUser } from '@/features/users/api/update-user'
import type { UserDetail } from '@/features/users/types/user'
import type { UpdateUserProfileInput } from '@/features/users/types/user-form'

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateUserProfileInput) => updateUser(userId, input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['users', 'detail', userId] })

      const previousUser = queryClient.getQueryData<UserDetail>(['users', 'detail', userId])

      if (previousUser) {
        queryClient.setQueryData<UserDetail>(['users', 'detail', userId], {
          ...previousUser,
          ...input,
        })
      }

      return { previousUser }
    },

    onError: (_err, _input, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['users', 'detail', userId], context.previousUser)
      }
      toast.error('Failed to update user profile')
    },

    onSuccess: (user) => {
      queryClient.setQueryData(['users', 'detail', user.id], user)
      toast.success('User profile updated')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

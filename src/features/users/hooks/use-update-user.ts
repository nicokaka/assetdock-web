import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUser } from '@/features/users/api/update-user'
import type { UserDetail } from '@/features/users/types/user'
import type { UpdateUserProfileInput } from '@/features/users/types/user-form'

function syncUserCaches(queryClient: ReturnType<typeof useQueryClient>, user: UserDetail) {
  queryClient.setQueryData(['users', 'detail', user.id], user)
  queryClient.setQueryData(['users', 'list'], (current: UserDetail[] | undefined) =>
    current?.map((item) => (item.id === user.id ? user : item)),
  )
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateUserProfileInput) => updateUser(userId, input),
    onSuccess: (user) => {
      syncUserCaches(queryClient, user)
    },
  })
}

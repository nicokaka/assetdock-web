import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUserRoles } from '@/features/users/api/update-user-roles'
import { updateUserStatus } from '@/features/users/api/update-user-status'
import type { UserDetail, UserRole, UserStatus } from '@/features/users/types/user'

function syncUserCaches(queryClient: ReturnType<typeof useQueryClient>, user: UserDetail) {
  queryClient.setQueryData(['users', 'detail', user.id], user)
  queryClient.setQueryData(['users', 'list'], (current: UserDetail[] | undefined) =>
    current?.map((item) => (item.id === user.id ? user : item)),
  )
}

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: UserStatus) => updateUserStatus(userId, { status }),
    onSuccess: (user) => {
      syncUserCaches(queryClient, user)
    },
  })
}

export function useUpdateUserRoles(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roles: UserRole[]) => updateUserRoles(userId, { roles }),
    onSuccess: (user) => {
      syncUserCaches(queryClient, user)
    },
  })
}

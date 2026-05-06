import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { updateUserRoles } from '@/features/users/api/update-user-roles'
import { updateUserStatus } from '@/features/users/api/update-user-status'
import type { UserDetail, UserRole, UserStatus } from '@/features/users/types/user'

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (status: UserStatus) => updateUserStatus(userId, { status }),

    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['users', 'detail', userId] })

      const previousUser = queryClient.getQueryData<UserDetail>(['users', 'detail', userId])

      if (previousUser) {
        queryClient.setQueryData<UserDetail>(['users', 'detail', userId], {
          ...previousUser,
          status: newStatus,
        })
      }

      return { previousUser }
    },

    onError: (_err, _status, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['users', 'detail', userId], context.previousUser)
      }
      toast.error(t('toast.user.statusError', 'Failed to update status'))
    },

    onSuccess: (user) => {
      queryClient.setQueryData(['users', 'detail', user.id], user)
      toast.success(t('toast.user.statusSuccess', 'User status updated'))
    },

    onSettled: () => {
      // Use void to handle the floating promise correctly
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserRoles(userId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (roles: UserRole[]) => updateUserRoles(userId, { roles }),

    onMutate: async (newRoles) => {
      await queryClient.cancelQueries({ queryKey: ['users', 'detail', userId] })

      const previousUser = queryClient.getQueryData<UserDetail>(['users', 'detail', userId])

      if (previousUser) {
        queryClient.setQueryData<UserDetail>(['users', 'detail', userId], {
          ...previousUser,
          roles: newRoles,
        })
      }

      return { previousUser }
    },

    onError: (_err, _roles, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['users', 'detail', userId], context.previousUser)
      }
      toast.error(t('toast.user.rolesError', 'Failed to update privileges'))
    },

    onSuccess: (user) => {
      queryClient.setQueryData(['users', 'detail', user.id], user)
      toast.success(t('toast.user.rolesSuccess', 'User privileges updated'))
    },

    onSettled: () => {
      // Use void to handle the floating promise correctly
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

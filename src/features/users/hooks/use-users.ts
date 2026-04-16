import { useQuery } from '@tanstack/react-query'

import { getUser } from '@/features/users/api/get-user'
import { listUsers, type UserListFilters } from '@/features/users/api/list-users'

export function useUsersListQuery(filters?: UserListFilters) {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => listUsers(filters),
  })
}

export function useUserDetailQuery(userId: string) {
  return useQuery({
    queryKey: ['users', 'detail', userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  })
}

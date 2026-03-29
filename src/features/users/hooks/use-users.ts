import { useQuery } from '@tanstack/react-query'

import { getUser } from '@/features/users/api/get-user'
import { listUsers } from '@/features/users/api/list-users'

export function useUsersListQuery() {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: listUsers,
  })
}

export function useUserDetailQuery(userId: string) {
  return useQuery({
    queryKey: ['users', 'detail', userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  })
}

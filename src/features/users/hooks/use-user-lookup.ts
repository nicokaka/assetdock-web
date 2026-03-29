import { useQuery } from '@tanstack/react-query'

import { listUsers } from '@/features/users/api/list-users'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users', 'lookup'],
    queryFn: listUsers,
  })
}

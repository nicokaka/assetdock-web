import { useQuery } from '@tanstack/react-query'

import { listUsers } from '@/features/users/api/list-users'

/**
 * Fetches users for use in lookup dropdowns (e.g., assignment form).
 * Uses a large page size to load all users in a single request.
 * This is intentionally separate from the paginated `useUsersListQuery`
 * used on the Users list page.
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: ['users', 'lookup'],
    queryFn: () => listUsers({ size: 500 }),
    staleTime: 5 * 60 * 1000, // 5 minutes — lookup data changes infrequently
  })
}

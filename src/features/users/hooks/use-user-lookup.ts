import { useQuery } from '@tanstack/react-query'

import { listUsers } from '@/features/users/api/list-users'

/**
 * Fetches users for use in lookup dropdowns (e.g., checkout form, assignment form).
 * Uses the backend's maximum page size (100) to load as many users as possible in
 * a single request. For organizations with more than 100 users, server-side search
 * should be implemented in the future.
 *
 * Note: This is intentionally separate from the paginated `useUsersListQuery`
 * used on the Users list page.
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: ['users', 'lookup'],
    // L-12: Aligned with backend cap — sending 500 had no effect, backend returned max 100.
    queryFn: () => listUsers({ size: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutes — lookup data changes infrequently
  })
}

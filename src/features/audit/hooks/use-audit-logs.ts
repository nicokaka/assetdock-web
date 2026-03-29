import { useQuery } from '@tanstack/react-query'

import { listAuditLogs } from '@/features/audit/api/list-audit-logs'
import type { AuditLogFilters } from '@/features/audit/types/audit-log'

export function useAuditLogsQuery(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => listAuditLogs(filters),
  })
}

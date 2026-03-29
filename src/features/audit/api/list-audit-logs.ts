import type { AuditLogFilters, AuditLogPage } from '@/features/audit/types/audit-log'
import { httpClient } from '@/lib/http-client'

function buildQueryString(filters?: AuditLogFilters) {
  const searchParams = new URLSearchParams()

  if (!filters) {
    return ''
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()

  return query ? `?${query}` : ''
}

export async function listAuditLogs(filters?: AuditLogFilters) {
  return httpClient.request<AuditLogPage>(
    `/api/v1/audit-logs${buildQueryString(filters)}`
  )
}

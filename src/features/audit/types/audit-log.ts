export type AuditLogItem = {
  id: string
  actorUserId: string | null
  eventType: string
  resourceType: string | null
  resourceId: string | null
  outcome: string | null
  occurredAt: string
}

export type AuditLogPage = {
  items: AuditLogItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type AuditLogFilters = {
  page?: number
  size?: number
  eventType?: string
  from?: string
  to?: string
  organizationId?: string
}

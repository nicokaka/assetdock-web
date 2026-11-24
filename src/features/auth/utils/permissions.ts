export type AppRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ASSET_MANAGER' | 'AUDITOR' | 'VIEWER'

const ASSET_MANAGER_ROLES: readonly AppRole[] = ['SUPER_ADMIN', 'ORG_ADMIN', 'ASSET_MANAGER']
const USER_READ_ROLES: readonly AppRole[] = ['SUPER_ADMIN', 'ORG_ADMIN', 'AUDITOR']
const USER_WRITE_ROLES: readonly AppRole[] = ['SUPER_ADMIN', 'ORG_ADMIN']
const IMPORT_READ_ROLES: readonly AppRole[] = ['SUPER_ADMIN', 'ORG_ADMIN', 'ASSET_MANAGER', 'AUDITOR']
const AUDIT_READ_ROLES: readonly AppRole[] = ['SUPER_ADMIN', 'ORG_ADMIN', 'AUDITOR']

function hasAnyRole(role: string | null | undefined, allowed: readonly AppRole[]): boolean {
  return Boolean(role && (allowed as readonly string[]).includes(role))
}

export function canManageAssets(role: string | null | undefined): boolean {
  return hasAnyRole(role, ASSET_MANAGER_ROLES)
}

export function canManageAssignments(role: string | null | undefined): boolean {
  return hasAnyRole(role, ASSET_MANAGER_ROLES)
}

export function canManagePeople(role: string | null | undefined): boolean {
  return hasAnyRole(role, ASSET_MANAGER_ROLES)
}

export function canViewUsers(role: string | null | undefined): boolean {
  return hasAnyRole(role, USER_READ_ROLES)
}

export function canManageUsers(role: string | null | undefined): boolean {
  return hasAnyRole(role, USER_WRITE_ROLES)
}

export function canViewImports(role: string | null | undefined): boolean {
  return hasAnyRole(role, IMPORT_READ_ROLES)
}

export function canImportAssets(role: string | null | undefined): boolean {
  return hasAnyRole(role, ASSET_MANAGER_ROLES)
}

export function canViewAuditLogs(role: string | null | undefined): boolean {
  return hasAnyRole(role, AUDIT_READ_ROLES)
}

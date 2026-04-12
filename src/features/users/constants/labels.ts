export const userStatusLabels: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LOCKED: 'Locked',
}

export const userRoleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Org Admin',
  ASSET_MANAGER: 'Asset Manager',
  AUDITOR: 'Auditor',
  VIEWER: 'Viewer',
}

export function userStatusClassName(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'INACTIVE':
      return 'border-slate-200 bg-slate-100 text-slate-700'
    case 'LOCKED':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    default:
      return 'border-border/70 bg-background/80 text-muted-foreground'
  }
}

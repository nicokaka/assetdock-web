export const assetStatusLabels: Record<string, string> = {
  ASSIGNED: 'Assigned',
  IN_STOCK: 'In Stock',
  IN_MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  LOST: 'Lost',
}

export function assetStatusClassName(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'IN_STOCK':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'IN_MAINTENANCE':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'RETIRED':
      return 'border-zinc-200 bg-zinc-100 text-zinc-700'
    case 'LOST':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    default:
      return 'border-border/70 bg-background/80 text-muted-foreground'
  }
}

export function assetStatusVariant(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'success' as const
    case 'IN_STOCK':
      return 'info' as const
    case 'IN_MAINTENANCE':
      return 'warning' as const
    case 'RETIRED':
      return 'muted' as const
    case 'LOST':
      return 'danger' as const
    default:
      return 'default' as const
  }
}


export const assetStatusLabels: Record<string, string> = {
  ASSIGNED: 'Assigned',
  IN_STOCK: 'In Stock',
  IN_MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
}

export function assetStatusClassName(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
    case 'IN_STOCK':
      return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-400'
    case 'IN_MAINTENANCE':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
    case 'RETIRED':
      return 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
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
    default:
      return 'default' as const
  }
}


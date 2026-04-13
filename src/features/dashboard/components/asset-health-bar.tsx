import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: 'hsl(142 71% 45%)',
  IN_STOCK: 'hsl(200 98% 39%)',
  IN_MAINTENANCE: 'hsl(38 92% 50%)',
  RETIRED: 'hsl(220 9% 56%)',
  LOST: 'hsl(0 84% 60%)',
}

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: 'Assigned',
  IN_STOCK: 'In Stock',
  IN_MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
  LOST: 'Lost',
}

// Display order: most positive statuses first
const STATUS_ORDER = ['ASSIGNED', 'IN_STOCK', 'IN_MAINTENANCE', 'RETIRED', 'LOST']

type Props = {
  statusCounts: Record<string, number>
  total: number
  healthRate: number
}

export function AssetHealthBar({ statusCounts, total, healthRate }: Props) {
  const orderedStatuses = STATUS_ORDER.filter((s) => statusCounts[s] !== undefined)

  const healthColor =
    healthRate >= 70
      ? 'text-emerald-600'
      : healthRate >= 40
        ? 'text-amber-600'
        : 'text-rose-600'

  return (
    <Card className="border-border/80 bg-card/78 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Asset Health
          </CardTitle>
          <span className={cn('text-sm font-semibold', healthColor)}>
            {healthRate}% operational
          </span>
        </div>

        {/* Segmented progress bar */}
        <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-secondary">
          {orderedStatuses.map((status) => {
            const pct = total > 0 ? (statusCounts[status] / total) * 100 : 0
            return (
              <div
                key={status}
                className="h-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: STATUS_COLORS[status] ?? 'hsl(220 9% 56%)',
                }}
                title={`${STATUS_LABELS[status]}: ${statusCounts[status]}`}
              />
            )
          })}
        </div>
      </CardHeader>

      {/* Compact breakdown list — Stripe style */}
      <CardContent className="pt-0">
        <div className="divide-y divide-border/40">
          {orderedStatuses.map((status) => {
            const count = statusCounts[status]
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={status} className="flex items-center gap-3 py-2.5">
                {/* Color dot */}
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                {/* Label */}
                <span className="flex-1 text-xs text-muted-foreground">
                  {STATUS_LABELS[status]}
                </span>
                {/* Mini bar */}
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: STATUS_COLORS[status],
                    }}
                  />
                </div>
                {/* Count + % */}
                <span className="w-14 text-right text-xs tabular-nums text-foreground">
                  {count}
                  <span className="ml-1 text-muted-foreground">({pct}%)</span>
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

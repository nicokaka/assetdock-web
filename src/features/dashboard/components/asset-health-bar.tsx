import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

type StatusCount = Record<string, number>

type Props = {
  statusCounts: StatusCount
  total: number
  healthRate: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">
        {STATUS_LABELS[item.dataKey] ?? item.dataKey}
      </p>
      <p className="text-muted-foreground">
        {item.value} asset{item.value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export function AssetHealthBar({ statusCounts, total, healthRate }: Props) {
  const statuses = Object.keys(statusCounts)

  // For the stacked bar we use a different approach — one bar per status,
  // rendered as a vertical grouped chart showing distribution
  const barData = statuses.map((status) => ({
    name: STATUS_LABELS[status] ?? status,
    status,
    count: statusCounts[status],
    fill: STATUS_COLORS[status] ?? 'hsl(220 9% 56%)',
  }))

  return (
    <Card className="border-border/80 bg-card/78 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Asset Health
          </CardTitle>
          <span className="text-sm font-semibold text-emerald-600">
            {healthRate}% operational
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-secondary">
          {statuses.map((status) => {
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
      <CardContent className="pt-2">
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              barSize={28}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={600}>
                {barData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

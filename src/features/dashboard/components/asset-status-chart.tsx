import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

type StatusDataItem = {
  status: string
  label: string
  count: number
  fill: string
  percentage: number
}

type Props = {
  data: StatusDataItem[]
  total: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: StatusDataItem }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{item.label}</p>
      <p className="text-muted-foreground">
        {item.count} asset{item.count !== 1 ? 's' : ''} · {item.percentage}%
      </p>
    </div>
  )
}

export function AssetStatusChart({ data, total }: Props) {
  if (data.length === 0) {
    return (
      <Card className="border-border/80 bg-card/78 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Asset Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">No data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/80 bg-card/78 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Asset Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
        {/* Donut */}
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="85%"
                strokeWidth={2}
                stroke="hsl(var(--background))"
                paddingAngle={2}
                animationBegin={0}
                animationDuration={600}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {total}
            </span>
            <span className="text-[10px] text-muted-foreground">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <Link
              key={item.status}
              to="/app/assets"
              className="flex items-center gap-2 group"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {item.label}
              </span>
              <span className="ml-auto text-xs font-medium tabular-nums text-foreground">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

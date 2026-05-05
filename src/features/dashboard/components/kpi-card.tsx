import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type KpiCardProps = {
  label: string
  value: string | number
  sublabel?: string
  icon: ReactNode
  to?: string
  accent?: 'default' | 'success' | 'warning' | 'danger'
}

const accentStyles = {
  default: 'text-foreground',
  success: 'text-emerald-600 dark:text-emerald-500',
  warning: 'text-amber-600 dark:text-amber-500',
  danger: 'text-rose-600 dark:text-rose-500',
}

const iconStyles = {
  default: 'bg-secondary text-muted-foreground',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-500',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-500',
  danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-500',
}

function KpiContent({ label, value, sublabel, icon, accent = 'default' }: KpiCardProps) {
  return (
    <CardContent className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              'text-3xl font-semibold tracking-tight leading-none',
              accentStyles[accent]
            )}
          >
            {value}
          </p>
          {sublabel ? (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          ) : null}
        </div>
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            iconStyles[accent]
          )}
        >
          {icon}
        </div>
      </div>
    </CardContent>
  )
}

export function KpiCard(props: KpiCardProps) {
  const card = (
    <Card className="border-border/80 bg-card/78 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md">
      <KpiContent {...props} />
    </Card>
  )

  if (props.to) {
    return (
      <Link to={props.to} className="group block">
        {card}
      </Link>
    )
  }

  return card
}

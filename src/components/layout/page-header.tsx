import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/70 px-5 py-5 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:px-6',
        className
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

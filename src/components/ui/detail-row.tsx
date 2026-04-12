import type { ReactNode } from 'react'

export function DetailRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">
        {value === null || value === undefined || value === '' ? 'Not provided' : value}
      </div>
    </div>
  )
}

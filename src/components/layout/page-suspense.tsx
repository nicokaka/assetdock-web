import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/table-skeleton'

/**
 * Suspense boundary for lazily-loaded page components.
 * Renders a consistent skeleton while the code chunk is fetching.
 */
export function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 py-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <TableSkeleton columns={5} />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

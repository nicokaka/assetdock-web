import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type TableSkeletonProps = {
  columns: number
  rows?: number
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={`th-${i}`}>
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={`tr-${i}`}>
            {Array.from({ length: columns }).map((_, j) => (
              <TableCell key={`td-${j}`}>
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

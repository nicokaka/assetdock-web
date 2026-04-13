import { useMemo } from 'react'

import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { useUsersListQuery } from '@/features/users/hooks/use-users'
import { assetStatusLabels } from '@/features/assets/constants/labels'

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: 'hsl(142 71% 45%)',
  IN_STOCK: 'hsl(200 98% 39%)',
  IN_MAINTENANCE: 'hsl(38 92% 50%)',
  RETIRED: 'hsl(220 9% 56%)',
  LOST: 'hsl(0 84% 60%)',
}

export function useDashboardStats() {
  const assetsQuery = useAssetsQuery()
  const usersQuery = useUsersListQuery()

  const stats = useMemo(() => {
    const assets = assetsQuery.data ?? []
    const users = usersQuery.data ?? []

    const nonArchived = assets.filter((a) => !a.archivedAt)
    const total = nonArchived.length
    const assigned = nonArchived.filter((a) => a.status === 'ASSIGNED').length
    const issues =
      nonArchived.filter((a) => a.status === 'LOST' || a.status === 'IN_MAINTENANCE').length
    const healthRate = total > 0 ? Math.round((assigned / total) * 100) : 0

    // Donut chart data
    const statusCounts = nonArchived.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.status] = (acc[asset.status] ?? 0) + 1
      return acc
    }, {})

    const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      label: assetStatusLabels[status] ?? status,
      count,
      fill: STATUS_COLORS[status] ?? 'hsl(220 9% 56%)',
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))

    // Health bar data (stacked)
    const healthBarData = [
      {
        name: 'Assets',
        ...Object.fromEntries(
          Object.entries(statusCounts).map(([status, count]) => [status, count])
        ),
      },
    ]

    return {
      total,
      assigned,
      userCount: users.length,
      issues,
      healthRate,
      statusChartData,
      healthBarData,
      statusCounts,
    }
  }, [assetsQuery.data, usersQuery.data])

  return {
    stats,
    isLoading: assetsQuery.isPending || usersQuery.isPending,
    isError: assetsQuery.isError || usersQuery.isError,
  }
}

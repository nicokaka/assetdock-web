import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getDashboardStats } from '@/features/dashboard/api/get-dashboard-stats'
import { assetStatusLabels } from '@/features/assets/constants/labels'

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: 'hsl(142 71% 45%)',
  IN_STOCK: 'hsl(200 98% 39%)',
  IN_MAINTENANCE: 'hsl(38 92% 50%)',
  RETIRED: 'hsl(220 9% 56%)',
  LOST: 'hsl(0 84% 60%)',
}

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  })

  const stats = useMemo(() => {
    if (!query.data) {
      return {
        total: 0,
        assigned: 0,
        userCount: 0,
        issues: 0,
        healthRate: 0,
        statusChartData: [],
        statusCounts: {},
      }
    }

    const {
      totalAssets,
      assignedAssets,
      inStockAssets,
      inMaintenanceAssets,
      retiredAssets,
      lostAssets,
      totalUsers,
    } = query.data

    const operational = assignedAssets + inStockAssets
    const issues = inMaintenanceAssets + lostAssets
    const healthRate = totalAssets > 0 ? Math.round((operational / totalAssets) * 100) : 0

    const statusCounts: Record<string, number> = {
      ASSIGNED: assignedAssets,
      IN_STOCK: inStockAssets,
      IN_MAINTENANCE: inMaintenanceAssets,
      RETIRED: retiredAssets,
      LOST: lostAssets,
    }

    const statusChartData = Object.entries(statusCounts)
      .filter((entry) => entry[1] > 0)
      .map(([status, count]) => ({
        status,
        label: assetStatusLabels[status] ?? status,
        count,
        fill: STATUS_COLORS[status] ?? 'hsl(220 9% 56%)',
        percentage: totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      total: totalAssets,
      assigned: assignedAssets,
      userCount: totalUsers,
      issues,
      healthRate,
      statusChartData,
      statusCounts,
    }
  }, [query.data])

  return {
    stats,
    isLoading: query.isPending,
    isError: query.isError,
  }
}

import { Server, CheckCircle2, Users, AlertTriangle } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'
import { KpiCard } from '@/features/dashboard/components/kpi-card'
import { AssetStatusChart } from '@/features/dashboard/components/asset-status-chart'
import { AssetHealthBar } from '@/features/dashboard/components/asset-health-bar'
import { RecentActivityFeed } from '@/features/dashboard/components/recent-activity-feed'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'

export function AppOverviewPage() {
  const { stats, isLoading } = useDashboardStats()

  return (
    <section className="space-y-6">
      <PageHeader
        title="Overview"
        description="Asset inventory status and recent operational activity."
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Assets"
          value={isLoading ? '—' : stats.total}
          sublabel="across all categories"
          icon={<Server className="h-4 w-4" />}
          to="/app/assets"
          accent="default"
        />
        <KpiCard
          label="Assigned"
          value={isLoading ? '—' : stats.assigned}
          sublabel={isLoading ? '' : `${stats.healthRate}% operational (assigned + in stock)`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          to="/app/assets"
          accent="success"
        />
        <KpiCard
          label="Users"
          value={isLoading ? '—' : stats.userCount}
          sublabel="registered in the org"
          icon={<Users className="h-4 w-4" />}
          to="/app/users"
          accent="default"
        />
        <KpiCard
          label="Issues"
          value={isLoading ? '—' : stats.issues}
          sublabel="lost or in maintenance"
          icon={<AlertTriangle className="h-4 w-4" />}
          to="/app/assets"
          accent={stats.issues > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AssetStatusChart data={stats.statusChartData} total={stats.total} />
        <AssetHealthBar
          statusCounts={stats.statusCounts}
          total={stats.total}
          healthRate={stats.healthRate}
        />
      </div>

      {/* Activity Feed */}
      <RecentActivityFeed />
    </section>
  )
}

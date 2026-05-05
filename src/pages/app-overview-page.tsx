import { Server, CheckCircle2, Users, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { KpiCard } from '@/features/dashboard/components/kpi-card'
import { AssetStatusChart } from '@/features/dashboard/components/asset-status-chart'
import { AssetHealthBar } from '@/features/dashboard/components/asset-health-bar'
import { RecentActivityFeed } from '@/features/dashboard/components/recent-activity-feed'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'

export function AppOverviewPage() {
  const { stats, isLoading } = useDashboardStats()
  const { t } = useTranslation()

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('app.overview.title', 'Overview')}
        description={t('app.overview.description', 'Asset inventory status and recent operational activity.')}
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('app.overview.kpi.totalAssets', 'Total Assets')}
          value={isLoading ? '—' : stats.total}
          sublabel={t('app.overview.kpi.totalAssetsSub', 'across all categories')}
          icon={<Server className="h-4 w-4" />}
          to="/app/assets"
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.assigned', 'Assigned')}
          value={isLoading ? '—' : stats.assigned}
          sublabel={isLoading ? '' : `${stats.healthRate}% ${t('app.overview.kpi.assignedSub', 'operational (assigned + in stock)')}`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          to="/app/assets"
          accent="success"
        />
        <KpiCard
          label={t('app.overview.kpi.users', 'Users')}
          value={isLoading ? '—' : stats.userCount}
          sublabel={t('app.overview.kpi.usersSub', 'registered in the org')}
          icon={<Users className="h-4 w-4" />}
          to="/app/users"
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.issues', 'Issues')}
          value={isLoading ? '—' : stats.issues}
          sublabel={t('app.overview.kpi.issuesSub', 'lost or in maintenance')}
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

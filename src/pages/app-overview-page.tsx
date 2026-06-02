import { Server, CheckCircle2, Users, AlertTriangle, ArrowLeftRight, Plus, FileUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/features/dashboard/components/kpi-card'
import { AssetStatusChart } from '@/features/dashboard/components/asset-status-chart'
import { AssetHealthBar } from '@/features/dashboard/components/asset-health-bar'
import { RecentActivityFeed } from '@/features/dashboard/components/recent-activity-feed'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { usePageTitle } from '@/hooks/use-page-title'

export function AppOverviewPage() {
  usePageTitle(useTranslation().t('app.header.overview', 'Overview'))
  const { stats, isLoading } = useDashboardStats()
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()

  const currentHour = new Date().getHours()
  let greetingKey = 'app.overview.greeting.evening'
  let greetingDefault = 'Good evening, {{name}}'
  if (currentHour < 12) {
    greetingKey = 'app.overview.greeting.morning'
    greetingDefault = 'Good morning, {{name}}'
  } else if (currentHour < 18) {
    greetingKey = 'app.overview.greeting.afternoon'
    greetingDefault = 'Good afternoon, {{name}}'
  }

  const firstName = sessionQuery.data?.user.fullName?.split(' ')[0] ?? ''

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title={t(greetingKey, { defaultValue: greetingDefault, name: firstName }).replace(/,\s*$/, '')}
          description={t('app.overview.description', 'Asset inventory status and recent operational activity.')}
          className="pb-0"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/app/assets/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {t('app.overview.quick.newAsset', 'New Asset')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/app/users/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {t('app.overview.quick.newUser', 'New User')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8">
            <Link to="/app/imports">
              <FileUp className="mr-1.5 h-3.5 w-3.5" />
              {t('app.overview.quick.import', 'Import CSV')}
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label={t('app.overview.kpi.totalAssets', 'Total Assets')}
          value={isLoading ? '—' : stats.total}
          sublabel={t('app.overview.kpi.totalAssetsSub', 'across all categories')}
          icon={<Server className="h-4 w-4" />}
          to="/app/assets"
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.assigned', 'Operational')}
          value={isLoading ? '—' : stats.operational}
          sublabel={isLoading ? '' : `${stats.healthRate}% ${t('app.overview.kpi.assignedSub', 'operational (assigned + in stock)')}`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          to="/app/assets"
          accent="success"
        />
        <KpiCard
          label={t('app.overview.kpi.activeCheckouts', 'Active Checkouts')}
          value={isLoading ? '—' : stats.activeCheckouts}
          sublabel={t('app.overview.kpi.activeCheckoutsSub', 'items currently checked out')}
          icon={<ArrowLeftRight className="h-4 w-4" />}
          to="/app/assets?status=ASSIGNED"
          accent="default"
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
          sublabel={t('app.overview.kpi.issuesSub', 'in maintenance')}
          icon={<AlertTriangle className="h-4 w-4" />}
          to="/app/assets?status=IN_MAINTENANCE"
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

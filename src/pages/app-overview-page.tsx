import {
  Server,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowLeftRight,
  Plus,
  FileUp,
  Laptop,
  Tv,
  Tablet,
  Keyboard,
  Mouse,
  Smartphone,
  Headphones,
  Printer,
  Package,
  ChevronRight,
} from 'lucide-react'
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
import { useCategoriesQuery } from '@/features/catalog/hooks/use-catalog-lookups'

function getCategoryIcon(name: string) {
  const normalized = name.toLowerCase()
  if (
    normalized.includes('mac') ||
    normalized.includes('laptop') ||
    normalized.includes('notebook') ||
    normalized.includes('computador')
  ) {
    return <Laptop className="h-5 w-5" />
  }
  if (
    normalized.includes('monitor') ||
    normalized.includes('tela') ||
    normalized.includes('display')
  ) {
    return <Tv className="h-5 w-5" />
  }
  if (normalized.includes('tablet') || normalized.includes('ipad')) {
    return <Tablet className="h-5 w-5" />
  }
  if (normalized.includes('teclado') || normalized.includes('keyboard')) {
    return <Keyboard className="h-5 w-5" />
  }
  if (normalized.includes('mouse')) {
    return <Mouse className="h-5 w-5" />
  }
  if (
    normalized.includes('phone') ||
    normalized.includes('celular') ||
    normalized.includes('smartphone') ||
    normalized.includes('telefone')
  ) {
    return <Smartphone className="h-5 w-5" />
  }
  if (
    normalized.includes('headset') ||
    normalized.includes('fone') ||
    normalized.includes('audio')
  ) {
    return <Headphones className="h-5 w-5" />
  }
  if (normalized.includes('impressora') || normalized.includes('printer')) {
    return <Printer className="h-5 w-5" />
  }
  return <Package className="h-5 w-5" />
}

export function AppOverviewPage() {
  usePageTitle(useTranslation().t('app.header.overview', 'Overview'))
  const { stats, isLoading } = useDashboardStats()
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()
  const { data: categories = [], isPending: categoriesLoading } = useCategoriesQuery()
  const activeCategories = categories.filter((c) => c.active)

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

      {categoriesLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-48 rounded bg-muted/40 animate-pulse" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[74px] items-center gap-3 rounded-xl border border-border/40 bg-card/25 p-4 animate-pulse"
              >
                <div className="h-9 w-9 rounded-xl bg-muted/40" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-16 rounded bg-muted/40" />
                  <div className="h-2 w-8 rounded bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeCategories.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground/90">
              {t('app.overview.categories.title', 'Quick Category Filters')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('app.overview.categories.description', 'Direct access to your inventory categorized by asset type.')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                to={`/app/assets?categoryId=${category.id}`}
                className="group relative flex items-center justify-between rounded-xl border border-border/50 bg-card/35 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:bg-accent/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {category.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium tracking-[0.05em] uppercase">
                      {t('app.assets.table.view', 'View')}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

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
          to="/app/assets?status=OPERATIONAL"
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
          label={t('app.overview.kpi.people', 'People')}
          value={isLoading ? '—' : stats.peopleCount}
          sublabel={t('app.overview.kpi.peopleSub', 'registered in the org')}
          icon={<Users className="h-4 w-4" />}
          to="/app/people"
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

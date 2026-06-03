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
  ChevronDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useMemo, useRef, useEffect } from 'react'

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
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { cn } from '@/lib/utils'
import { assetStatusLabels } from '@/features/assets/constants/labels'

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
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { data: categories = [] } = useCategoriesQuery()
  const assetsQuery = useAssetsQuery({ size: 1000 })
  const allAssets = useMemo(() => assetsQuery.data?.items ?? [], [assetsQuery.data?.items])
  const isAssetsLoading = assetsQuery.isPending

  const [selectedOptionId, setSelectedOptionId] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const filterOptions = useMemo(() => {
    const options = [
      {
        id: 'all',
        name: t('app.overview.categories.all', 'All Categories'),
        categoryIds: [] as string[],
        icon: <Server className="h-3.5 w-3.5" />,
        count: allAssets.length,
      },
    ]

    if (!categories.length) return options

    // Group Laptop (Mac) and Laptop (PC) category IDs under a single "Laptops" filter
    const laptopCategoryIds = categories
      .filter((c) => {
        const nameLower = c.name.toLowerCase()
        return (
          nameLower.includes('laptop') ||
          nameLower.includes('notebook') ||
          nameLower.includes('macbook') ||
          nameLower.includes('computador')
        )
      })
      .map((c) => c.id)

    if (laptopCategoryIds.length > 0) {
      const laptopCount = allAssets.filter(
        (a) => a.categoryId && laptopCategoryIds.includes(a.categoryId)
      ).length
      options.push({
        id: 'laptops',
        name: t('app.overview.categories.laptops', 'Laptops'),
        categoryIds: laptopCategoryIds,
        icon: <Laptop className="h-3.5 w-3.5" />,
        count: laptopCount,
      })
    }

    // Other categories list
    categories.forEach((c) => {
      if (laptopCategoryIds.includes(c.id)) return
      if (!c.active) return

      const count = allAssets.filter((a) => a.categoryId === c.id).length
      options.push({
        id: c.id,
        name: c.name,
        categoryIds: [c.id],
        icon: getCategoryIcon(c.name),
        count,
      })
    })

    return options
  }, [categories, allAssets, t])

  const selectedOption = useMemo(() => {
    return filterOptions.find((o) => o.id === selectedOptionId) ?? filterOptions[0]
  }, [filterOptions, selectedOptionId])

  const isCurrentLoading = selectedOptionId === 'all' ? statsLoading : isAssetsLoading

  const displayStats = useMemo(() => {
    if (selectedOptionId === 'all') {
      return stats
    }

    const filteredAssets = allAssets.filter(
      (a) => a.categoryId && selectedOption.categoryIds.includes(a.categoryId)
    )

    const total = filteredAssets.length
    const assigned = filteredAssets.filter((a) => a.status === 'ASSIGNED').length
    const inStock = filteredAssets.filter((a) => a.status === 'IN_STOCK').length
    const inMaintenance = filteredAssets.filter((a) => a.status === 'IN_MAINTENANCE').length
    const retired = filteredAssets.filter((a) => a.status === 'RETIRED').length

    const operational = assigned + inStock
    const issues = inMaintenance
    const healthRate = total > 0 ? Math.round((operational / total) * 100) : 0

    // Compute people count having assets in this category group assigned
    const assignedPersonIds = new Set(
      filteredAssets
        .filter((a) => a.status === 'ASSIGNED' && a.currentAssignedPersonId)
        .map((a) => a.currentAssignedPersonId)
    )
    const peopleCount = assignedPersonIds.size

    const statusCounts = {
      ASSIGNED: assigned,
      IN_STOCK: inStock,
      IN_MAINTENANCE: inMaintenance,
      RETIRED: retired,
    }

    const STATUS_COLORS: Record<string, string> = {
      ASSIGNED: 'hsl(142 71% 45%)',
      IN_STOCK: 'hsl(200 98% 39%)',
      IN_MAINTENANCE: 'hsl(38 92% 50%)',
      RETIRED: 'hsl(220 9% 56%)',
    }

    const statusChartData = Object.entries(statusCounts)
      .filter((entry) => entry[1] > 0)
      .map(([status, count]) => ({
        status,
        label: assetStatusLabels[status] ?? status,
        count,
        fill: STATUS_COLORS[status] ?? 'hsl(220 9% 56%)',
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      total,
      assigned,
      inStock,
      operational,
      peopleCount,
      issues,
      healthRate,
      statusChartData,
      statusCounts,
      activeCheckouts: assigned,
    }
  }, [selectedOptionId, selectedOption, allAssets, stats])

  const getFilterUrl = (basePath: string, status?: string) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    
    if (selectedOptionId !== 'all' && selectedOption.categoryIds.length === 1) {
      params.set('categoryId', selectedOption.categoryIds[0])
    }
    
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

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

      {/* Category Dropdown Filter */}
      {filterOptions.length > 1 && (
        <div className="flex flex-col gap-1.5 border-b border-border/30 pb-4">
          <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isCurrentLoading}
              className={cn(
                'group flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-55',
                'bg-card/45 hover:bg-accent/30 border border-border/50 text-foreground shadow-xs'
              )}
            >
              <span className="text-primary transition-transform duration-200 group-hover:scale-105">
                {selectedOption.icon}
              </span>
              <span>{selectedOption.name}</span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary/10 text-primary">
                {selectedOption.count}
              </span>
              <ChevronDown className={cn('ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200', isDropdownOpen && 'rotate-180')} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-card border border-border/60 rounded-xl shadow-xl backdrop-blur-md p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 pb-1.5 mb-1">
                  {t('app.overview.categories.title', 'Filter by Category')}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {filterOptions.map((opt) => {
                    const isOptActive = selectedOptionId === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedOptionId(opt.id)
                          setIsDropdownOpen(false)
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer',
                          isOptActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(isOptActive ? 'text-primary' : 'text-muted-foreground')}>
                            {opt.icon}
                          </span>
                          <span>{opt.name}</span>
                        </div>
                        <span
                          className={cn(
                            'px-1.5 py-0.5 text-[9px] font-bold rounded-md',
                            isOptActive
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted-foreground/10 text-muted-foreground'
                          )}
                        >
                          {opt.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label={t('app.overview.kpi.totalAssets', 'Total Assets')}
          value={isCurrentLoading ? '—' : displayStats.total}
          sublabel={t('app.overview.kpi.totalAssetsSub', 'across all categories')}
          icon={<Server className="h-4 w-4" />}
          to={getFilterUrl('/app/assets')}
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.assigned', 'Operational')}
          value={isCurrentLoading ? '—' : displayStats.operational}
          sublabel={isCurrentLoading ? '' : `${displayStats.healthRate}% ${t('app.overview.kpi.assignedSub', 'operational (assigned + in stock)')}`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          to={getFilterUrl('/app/assets', 'OPERATIONAL')}
          accent="success"
        />
        <KpiCard
          label={t('app.overview.kpi.activeCheckouts', 'Active Checkouts')}
          value={isCurrentLoading ? '—' : displayStats.activeCheckouts}
          sublabel={t('app.overview.kpi.activeCheckoutsSub', 'items currently checked out')}
          icon={<ArrowLeftRight className="h-4 w-4" />}
          to={getFilterUrl('/app/assets', 'ASSIGNED')}
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.people', 'People')}
          value={isCurrentLoading ? '—' : displayStats.peopleCount}
          sublabel={
            selectedOptionId === 'all'
              ? t('app.overview.kpi.peopleSub', 'employees registered in the org')
              : t('app.overview.categories.peopleAssigned', 'people with items assigned')
          }
          icon={<Users className="h-4 w-4" />}
          to="/app/people"
          accent="default"
        />
        <KpiCard
          label={t('app.overview.kpi.issues', 'Issues')}
          value={isCurrentLoading ? '—' : displayStats.issues}
          sublabel={t('app.overview.kpi.issuesSub', 'in maintenance')}
          icon={<AlertTriangle className="h-4 w-4" />}
          to={getFilterUrl('/app/assets', 'IN_MAINTENANCE')}
          accent={displayStats.issues > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AssetStatusChart data={displayStats.statusChartData} total={displayStats.total} />
        <AssetHealthBar
          statusCounts={displayStats.statusCounts}
          total={displayStats.total}
          healthRate={displayStats.healthRate}
        />
      </div>

      {/* Activity Feed */}
      <RecentActivityFeed />
    </section>
  )
}

import { Link } from 'react-router-dom'
import {
  LogIn,
  LogOut,
  UserPlus,
  Package,
  PackageCheck,
  PackageX,
  Clock,
  RefreshCw,
  ArrowRight,
  Activity,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuditLogsQuery } from '@/features/audit/hooks/use-audit-logs'
import type { AuditLogItem } from '@/features/audit/types/audit-log'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

function getEventIcon(eventType: string) {
  if (eventType.startsWith('LOGIN')) return <LogIn className="h-3.5 w-3.5" />
  if (eventType === 'WEB_SESSION_CREATED') return <LogIn className="h-3.5 w-3.5" />
  if (eventType === 'WEB_SESSION_LOGGED_OUT') return <LogOut className="h-3.5 w-3.5" />
  if (eventType === 'WEB_SESSION_EXPIRED') return <Clock className="h-3.5 w-3.5" />
  if (eventType === 'USER_CREATED') return <UserPlus className="h-3.5 w-3.5" />
  if (eventType === 'ASSET_CREATED') return <Package className="h-3.5 w-3.5" />
  if (eventType === 'ASSET_ASSIGNED') return <PackageCheck className="h-3.5 w-3.5" />
  if (eventType === 'ASSET_UNASSIGNED') return <PackageX className="h-3.5 w-3.5" />
  if (eventType === 'ASSET_UPDATED' || eventType === 'USER_UPDATED')
    return <RefreshCw className="h-3.5 w-3.5" />
  return <Activity className="h-3.5 w-3.5" />
}

function getEventLabel(eventType: string, t: TFunction): string {
  const fallback = eventType.replace(/_/g, ' ').toLowerCase()
  // Translation keys are inside app.overview.events.
  // We use the eventType directly, e.g. "LOGIN_SUCCESS"
  const translated = t(`app.overview.events.${eventType}`, { defaultValue: fallback })
  return translated
}

function timeAgo(iso: string, t: TFunction): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return t('app.overview.activity.justNow', 'just now')
  if (minutes < 60) return `${minutes}${t('app.overview.activity.mAgo', 'm ago')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t('app.overview.activity.hAgo', 'h ago')}`
  const days = Math.floor(hours / 24)
  return `${days}${t('app.overview.activity.dAgo', 'd ago')}`
}

function ActivityItem({ item, t }: { item: AuditLogItem, t: TFunction }) {
  const isSuccess = item.outcome === 'SUCCESS' || item.outcome === null
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isSuccess
            ? 'bg-secondary text-muted-foreground'
            : 'bg-rose-50 text-rose-600'
        }`}
      >
        {getEventIcon(item.eventType)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground leading-snug">
          {getEventLabel(item.eventType, t)}
        </p>
      </div>
      <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
        {timeAgo(item.occurredAt, t)}
      </span>
    </div>
  )
}

export function RecentActivityFeed() {
  const query = useAuditLogsQuery({ size: 7 })
  const items = query.data?.items ?? []
  const { t } = useTranslation()

  return (
    <Card className="border-border/80 bg-card/78 shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('app.overview.activity.title', 'Recent Activity')}
          </CardTitle>
          <Link
            to="/app/audit-logs"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('app.overview.activity.viewAll', 'View all')}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {query.isPending ? (
          <div className="space-y-2 pt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="h-6 w-6 rounded-full bg-secondary animate-pulse" />
                <div className="h-3 flex-1 rounded bg-secondary animate-pulse" />
                <div className="h-3 w-10 rounded bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="pt-4 text-xs text-muted-foreground">{t('app.overview.activity.noActivity', 'No activity yet.')}</p>
        ) : (
          <div className="divide-y divide-border/40">
            {items.map((item) => (
              <ActivityItem key={item.id} item={item} t={t} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

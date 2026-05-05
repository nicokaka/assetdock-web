import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApiHealth } from '@/features/setup/hooks/use-api-health'
import { useSessionQuery } from '@/features/auth/hooks/use-session'

export function HomePage() {
  const { t } = useTranslation()
  const healthQuery = useApiHealth()
  const sessionQuery = useSessionQuery({ enabled: true })
  const isHealthy = healthQuery.data === true

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,28rem)] lg:items-center">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium tracking-tight text-muted-foreground">
              {t('public.home.kicker', 'Asset inventory and access operations')}
            </p>
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                isHealthy
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : healthQuery.isPending
                    ? 'border-muted bg-muted/50 text-muted-foreground'
                    : 'border-destructive/20 bg-destructive/10 text-destructive'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isHealthy
                    ? 'bg-emerald-500'
                    : healthQuery.isPending
                      ? 'bg-muted-foreground/50'
                      : 'bg-destructive'
                }`}
              />
              {isHealthy 
                ? t('public.home.apiOnline', 'API Online') 
                : healthQuery.isPending 
                  ? t('public.home.apiChecking', 'Checking API...') 
                  : t('public.home.apiOffline', 'API Offline')}
            </div>
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t('public.home.title', 'AssetDock Web')}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {t('public.home.description', 'A sober browser interface for assets, users, imports, and audit activity, built to work directly with the AssetDock API.')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to={sessionQuery.data ? "/app" : "/login"}>
              {sessionQuery.data ? t('public.home.openAppAuth', 'Open application') : t('public.home.openApp', 'Open the app')}
            </Link>
          </Button>
          {sessionQuery.data && (
            <Button asChild variant="outline">
              <Link to="/app">{t('public.home.viewAuth', 'View authenticated area')}</Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/80 bg-card/88 shadow-md backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            {t('public.home.mvpTitle', 'Current MVP areas')}
          </CardTitle>
          <CardDescription className="leading-6">
            {t('public.home.mvpDescription', 'The app already covers the main operational flows without adding visual noise.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            {t('public.home.mvpItem1', 'Assets, lifecycle actions, and assignments')}
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            {t('public.home.mvpItem2', 'Users, roles, and status updates')}
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
            {t('public.home.mvpItem3', 'Audit logs and CSV imports')}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

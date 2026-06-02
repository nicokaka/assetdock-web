import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { CommandPalette } from '@/components/ui/command-palette'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useLogoutMutation, useSessionQuery } from '@/features/auth/hooks/use-session'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'
import { cn } from '@/lib/utils'
import { APP_VERSION } from '@/lib/version'

export function AuthenticatedShell() {

  const [modifierKey] = useState<string>(
    () => {
      const platform = (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ?? navigator.userAgent
      return /mac|iphone|ipod|ipad/i.test(platform) ? 'Cmd' : 'Ctrl'
    }
  )

  const sessionQuery = useSessionQuery()
  const logoutMutation = useLogoutMutation()
  const { stats } = useDashboardStats()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_60%)] pointer-events-none" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-8 rounded-2xl border border-border/80 bg-background/88 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:px-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  AssetDock
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>{sessionQuery.data?.user.fullName}</span>
                  <span className="hidden text-border sm:inline">•</span>
                  <span>{sessionQuery.data?.user.email}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <nav className="flex flex-wrap items-center gap-1.5">
                  <NavLink
                    to="/app"
                    end
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.overview', 'Overview')}
                  </NavLink>
                  <NavLink
                    to="/app/assets"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.assets', 'Assets')} {stats.total > 0 && <span className="ml-1 opacity-60">({stats.total})</span>}
                  </NavLink>
                  <NavLink
                    to="/app/people"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.people', 'People')} {stats.peopleCount > 0 && <span className="ml-1 opacity-60">({stats.peopleCount})</span>}
                  </NavLink>
                  <NavLink
                    to="/app/users"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.users', 'Users')}
                  </NavLink>
                  <NavLink
                    to="/app/imports"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.imports', 'Imports')}
                  </NavLink>
                  <NavLink
                    to="/app/audit-logs"
                    className={({ isActive }) =>
                      cn(
                        'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none',
                        isActive && 'bg-secondary text-foreground shadow-sm'
                      )
                    }
                  >
                    {t('app.header.auditLogs', 'Audit Logs')}
                  </NavLink>
                </nav>
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <LanguageToggle />
                  <ThemeToggle />
                  <button
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))}
                    className="hidden lg:flex items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <Search className="h-4 w-4" />
                    <span className="flex-1 text-left">{t('app.header.searchPlaceholder', 'Search...')}</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">{modifierKey}</span> K
                    </kbd>
                  </button>
                  <Button
                    variant="outline"
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))}
                    className="lg:hidden border-border/80 bg-background/80 hover:bg-accent/80"
                    size="icon"
                    title={t('app.header.search', 'Search')}
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">{t('app.header.search', 'Search')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="border-border/80 bg-background/80 hover:bg-accent/80"
                  >
                    {logoutMutation.isPending ? '...' : t('app.header.signOut', 'Sign out')}
                  </Button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 pb-10">
            <Outlet />
          </main>
          
            <footer className="mt-auto border-t border-border/40 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              AssetDock v{APP_VERSION} &middot; &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>
      <CommandPalette />
    </div>
  )
}

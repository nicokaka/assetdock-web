import { NavLink, Outlet } from 'react-router-dom'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CommandPalette } from '@/components/ui/command-palette'
import { useLogoutMutation, useSessionQuery } from '@/features/auth/hooks/use-session'
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats'
import { cn } from '@/lib/utils'



export function AuthenticatedShell() {
  const sessionQuery = useSessionQuery()
  const logoutMutation = useLogoutMutation()
  const { stats } = useDashboardStats()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_60%)]" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-8 rounded-2xl border border-border/80 bg-background/88 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:px-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  AssetDock Web
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
                    Overview
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
                    Assets {stats.total > 0 && <span className="ml-1 opacity-60">({stats.total})</span>}
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
                    Users {stats.userCount > 0 && <span className="ml-1 opacity-60">({stats.userCount})</span>}
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
                    Imports
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
                    Audit Logs
                  </NavLink>
                </nav>
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <div className="hidden lg:flex items-center text-sm text-muted-foreground/60 mr-2">
                    Press <kbd className="mx-1 rounded border bg-muted px-1.5 font-mono text-[10px]">Cmd K</kbd> to search
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                    className="border-border/80 bg-background/80 hover:bg-accent/80"
                    size="icon"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="border-border/80 bg-background/80 hover:bg-accent/80"
                  >
                    {logoutMutation.isPending ? '...' : 'Sign out'}
                  </Button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette />
    </div>
  )
}

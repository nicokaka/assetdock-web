import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useLogoutMutation, useSessionQuery } from '@/features/auth/hooks/use-session'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/app', label: 'Overview', end: true },
  { to: '/app/assets', label: 'Assets' },
  { to: '/app/users', label: 'Users' },
  { to: '/app/imports', label: 'Imports' },
  { to: '/app/audit-logs', label: 'Audit Logs' },
]

export function AuthenticatedShell() {
  const sessionQuery = useSessionQuery()
  const logoutMutation = useLogoutMutation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_60%)]" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-8 rounded-2xl border border-border/80 bg-background/88 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:justify-end">
                <nav className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1 pb-1 lg:justify-end">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                          isActive && 'bg-secondary text-foreground shadow-sm'
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="self-start border-border/80 bg-background/80 sm:self-auto"
                >
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

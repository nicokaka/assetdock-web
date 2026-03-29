import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useLogoutMutation, useSessionQuery } from '@/features/auth/hooks/use-session'
import { cn } from '@/lib/utils'

const navigation = [
  { to: '/app', label: 'Overview', end: true },
  { to: '/app/assets', label: 'Assets' },
  { to: '/app/imports', label: 'Imports' },
  { to: '/app/audit-logs', label: 'Audit Logs' },
]

export function AuthenticatedShell() {
  const sessionQuery = useSessionQuery()
  const logoutMutation = useLogoutMutation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium tracking-tight text-foreground">
              AssetDock Web
            </div>
            <div className="text-sm text-muted-foreground">
              {sessionQuery.data?.user.fullName}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-lg border border-border p-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground',
                      isActive && 'bg-secondary text-foreground'
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
            >
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </header>
        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

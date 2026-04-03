import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppShell() {
  const location = useLocation()
  const isAuthenticatedArea = location.pathname.startsWith('/app')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.1),transparent_58%)]" />
        <div className="absolute left-0 top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.16),transparent_70%)] blur-3xl" />
        <div
          className={
            isAuthenticatedArea
              ? 'mx-auto min-h-screen w-full max-w-7xl'
              : 'mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8'
          }
        >
          {!isAuthenticatedArea ? (
            <header className="rounded-2xl border border-border/80 bg-background/88 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/72 sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <Link
                  to="/"
                  className="text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-primary"
                >
                  AssetDock Web
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-border/80 px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-accent/70 hover:text-foreground"
                >
                  Login
                </Link>
              </div>
            </header>
          ) : null}
          <main className={isAuthenticatedArea ? 'min-h-screen' : 'flex flex-1 items-center py-10'}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

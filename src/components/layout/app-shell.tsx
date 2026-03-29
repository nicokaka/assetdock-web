import { Link, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <Link
            to="/"
            className="text-sm font-medium tracking-tight text-foreground transition-colors hover:text-primary"
          >
            AssetDock Web
          </Link>
          <Link
            to="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
        </header>
        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

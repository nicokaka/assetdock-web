import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8">
        <header className="border-b border-border pb-4">
          <div className="text-sm font-medium tracking-tight text-foreground">
            AssetDock Web
          </div>
        </header>
        <main className="flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}

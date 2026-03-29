import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetsList } from '@/features/assets/components/assets-list'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'

export function AssetsPage() {
  const assetsQuery = useAssetsQuery()

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
        <p className="text-sm text-muted-foreground">
          A simple list view of assets from the authenticated area.
        </p>
      </header>

      {assetsQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading assets...
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Unable to load assets right now.
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.length === 0 ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">No assets yet</CardTitle>
            <CardDescription>
              Assets will appear here once the backend returns data for the current
              session.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.length > 0 ? (
        <AssetsList assets={assetsQuery.data} />
      ) : null}
    </section>
  )
}

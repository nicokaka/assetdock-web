import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssetsList } from '@/features/assets/components/assets-list'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { TableSkeleton } from '@/components/ui/table-skeleton'

export function AssetsPage() {
  const assetsQuery = useAssetsQuery()

  return (
    <section className="space-y-6">
      <PageHeader
        title="Assets"
        description="Review the assets available to the current session."
        action={
          <Button asChild variant="outline">
          <Link to="/app/assets/new">New Asset</Link>
          </Button>
        }
      />

      {assetsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : null}

      {assetsQuery.isError ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Unable to load assets right now.
          </CardContent>
        </Card>
      ) : null}

      {assetsQuery.isSuccess && assetsQuery.data.length === 0 ? (
        <Card className="border-border/80 bg-card/78 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">No assets yet</CardTitle>
            <CardDescription>
              Create the first asset to start working with the inventory area.
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

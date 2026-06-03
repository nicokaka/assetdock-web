import { useNavigate, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Edit2, Calendar, Clipboard, Laptop } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePersonDetailQuery, usePersonHistoryQuery } from '@/features/people/hooks/use-people'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { formatTimestamp } from '@/lib/format'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function PersonDetailPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { personId = '' } = useParams()
  
  const personQuery = usePersonDetailQuery(personId)
  const historyQuery = usePersonHistoryQuery(personId)
  const assetsQuery = useAssetsQuery({ size: 1000 }) // Load up to 1000 assets to map asset IDs

  const personLabel = personQuery.data?.fullName || t('breadcrumb.person', 'Person')
  usePageTitle(personLabel)

  const isNotFound =
    personQuery.isError &&
    personQuery.error instanceof HttpError &&
    personQuery.error.status === 404

  const assetsMap = new Map<string, { name: string; tag: string }>()
  if (assetsQuery.data?.items) {
    assetsQuery.data.items.forEach(asset => {
      assetsMap.set(asset.id, {
        name: asset.displayName || asset.assetTag,
        tag: asset.assetTag,
      })
    })
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.people', 'People'), href: '/app/people' },
            { label: personLabel },
          ]}
        />
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/app/people')} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('personForm.back', 'Back to people')}
          </button>
          {personQuery.isSuccess ? (
            <Link
              to={`/app/people/${personId}/edit`}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {t('details.actions.editPerson', 'Edit Person')}
            </Link>
          ) : null}
        </div>
      </div>

      {personQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('common.loading', 'Loading...')}</CardTitle>
            <CardDescription>
              {t('details.loadingPerson', 'Fetching the latest person details.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('personForm.errorTitle', 'Person not found')}</CardTitle>
            <CardDescription>
              {t('personForm.emptyDescriptionFilters', 'The requested person is unavailable for the current session.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {personQuery.isError && !isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('personForm.errorTitle', 'Unable to load person')}</CardTitle>
            <CardDescription>
              {t('personForm.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {personQuery.isSuccess ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Profile Card */}
          <div className="space-y-6 md:col-span-1">
            <Card className="border-border shadow-none">
              <CardHeader className="gap-1">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {personQuery.data.fullName}
                </CardTitle>
                <div className="text-sm text-muted-foreground">{personQuery.data.email || t('common.na', 'N/A')}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-1 sm:grid-cols-[100px_1fr] sm:gap-4">
                  <div className="text-sm text-muted-foreground">{t('details.labels.status', 'Status')}</div>
                  <div>
                    <Badge variant={personQuery.data.active ? 'success' : 'muted'}>
                      {personQuery.data.active ? t('personForm.status.active', 'Active') : t('personForm.status.inactive', 'Inactive')}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-1 sm:grid-cols-[100px_1fr] sm:gap-4">
                  <div className="text-sm text-muted-foreground">{t('details.labels.department', 'Department')}</div>
                  <div className="text-sm font-medium">{personQuery.data.department || t('common.na', 'N/A')}</div>
                </div>

                <div className="grid gap-1 sm:grid-cols-[100px_1fr] sm:gap-4">
                  <div className="text-sm text-muted-foreground">{t('details.labels.createdAt', 'Created')}</div>
                  <div className="text-sm text-muted-foreground">{formatTimestamp(personQuery.data.createdAt)}</div>
                </div>

                <div className="grid gap-1 sm:grid-cols-[100px_1fr] sm:gap-4">
                  <div className="text-sm text-muted-foreground">{t('details.labels.updatedAt', 'Updated')}</div>
                  <div className="text-sm text-muted-foreground">{formatTimestamp(personQuery.data.updatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Checkout History Timeline */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {t('details.assignments.history', 'Asset History')}
                </CardTitle>
                <CardDescription>
                  {t('details.assignments.historyDescription', 'Timeline of computers and physical items checked out to this person.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {historyQuery.isPending ? (
                  <p className="text-sm text-muted-foreground">{t('details.assignments.loading', 'Loading history...')}</p>
                ) : null}

                {historyQuery.isError ? (
                  <p className="text-sm text-destructive">{t('details.assignments.historyError', 'Unable to load checkout history right now.')}</p>
                ) : null}

                {historyQuery.isSuccess && historyQuery.data.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <Laptop className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                    {t('details.assignments.historyEmpty', 'No checkout history found for this person.')}
                  </div>
                ) : null}

                {historyQuery.isSuccess && historyQuery.data.length > 0 ? (
                  <div className="space-y-4 relative border-l border-border pl-6 ml-3">
                    {historyQuery.data.map((checkout) => {
                      const asset = assetsMap.get(checkout.assetId)
                      const assetName = asset ? asset.name : `Asset ${checkout.assetId.slice(0, 8)}…`
                      const assetTag = asset ? asset.tag : undefined
                      const isActive = checkout.checkedInAt === null

                      return (
                        <div key={checkout.id} className="relative group pb-2">
                          {/* Timeline dot */}
                          <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-background z-10 transition-colors ${
                            isActive ? 'border-amber-500' : 'border-emerald-500'
                          }`} />

                          <div className="rounded-lg border border-border p-4 bg-card shadow-none">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-2">
                                <Laptop className="h-4 w-4 text-muted-foreground" />
                                <Link
                                  to={`/app/assets/${checkout.assetId}`}
                                  className="font-medium text-foreground hover:underline"
                                >
                                  {assetName}
                                </Link>
                                {assetTag && (
                                  <span className="text-xs text-muted-foreground font-mono">({assetTag})</span>
                                )}
                              </div>
                              <Badge variant={isActive ? 'warning' : 'success'}>
                                {isActive ? t('details.assignments.active', 'Checked Out') : t('details.assignments.closed', 'Returned')}
                              </Badge>
                            </div>

                            <div className="mt-3 grid gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {t('app.timeline.checkedOut', 'Checked out')}: {new Date(checkout.checkedOutAt).toLocaleDateString()}
                                </span>
                              </div>
                              {checkout.expectedReturnDate && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {t('app.checkout.expectedReturn', 'Expected return')}: {new Date(checkout.expectedReturnDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {checkout.checkedInAt && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {t('app.timeline.checkedIn', 'Returned')}: {new Date(checkout.checkedInAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {checkout.notes && (
                              <div className="mt-3 text-xs bg-muted/50 p-2 rounded text-muted-foreground flex gap-1.5 items-start">
                                <Clipboard className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <span className="whitespace-pre-wrap">{checkout.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </section>
  )
}

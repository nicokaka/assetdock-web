import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Edit2, Calendar, Clipboard, Laptop } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePersonDetailQuery, usePersonHistoryQuery } from '@/features/people/hooks/use-people'
import { useAssetsQuery } from '@/features/assets/hooks/use-assets'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { canManageAssignments, canManagePeople } from '@/features/auth/utils/permissions'
import { CheckinDialog } from '@/features/checkout/components/checkin-dialog'
import { PersonCheckoutDialog } from '@/features/checkout/components/person-checkout-dialog'
import { formatTimestamp } from '@/lib/format'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function PersonDetailPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { personId = '' } = useParams()
  const [nowTimestamp] = useState(() => Date.now())
  const sessionQuery = useSessionQuery()
  const role = sessionQuery.data?.user.role
  const canEditPeople = canManagePeople(role)
  const canAssign = canManageAssignments(role)

  const personQuery = usePersonDetailQuery(personId)
  const historyQuery = usePersonHistoryQuery(personId)
  const assetsQuery = useAssetsQuery({ size: 100 })

  const personLabel = personQuery.data?.fullName || t('breadcrumb.person', 'Person')
  usePageTitle(personLabel)

  const isNotFound =
    personQuery.isError &&
    personQuery.error instanceof HttpError &&
    personQuery.error.status === 404

  const assetsMap = new Map<string, { name: string; tag: string }>()
  if (assetsQuery.data?.items) {
    assetsQuery.data.items.forEach((asset) => {
      assetsMap.set(asset.id, {
        name: asset.displayName || asset.assetTag,
        tag: asset.assetTag,
      })
    })
  }

  const allCheckouts = historyQuery.data ?? []
  const activeCheckouts = allCheckouts.filter((checkout) => checkout.checkedInAt === null)
  const pastCheckouts = allCheckouts.filter((checkout) => checkout.checkedInAt !== null)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Breadcrumbs
          items={[
            { label: t('app.header.people', 'People'), href: '/app/people' },
            { label: personLabel },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => navigate('/app/people')} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('personForm.back', 'Back to people')}
          </button>
          {personQuery.isSuccess && personQuery.data.active && canAssign ? (
            <PersonCheckoutDialog personId={personId} personName={personQuery.data.fullName} />
          ) : null}
          {personQuery.isSuccess && canEditPeople ? (
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

          {/* Right Column: Active Holdings & Returned History */}
          <div className="space-y-6 md:col-span-2">
            {/* Active Holdings */}
            <Card className="border-border shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {t('details.assignments.currentHoldings', 'Currently Assigned Assets')} ({activeCheckouts.length})
                  </CardTitle>
                </div>
                <CardDescription>
                  {t(
                    'details.assignments.currentHoldingsDescription',
                    'Equipment and items currently in custody of this person.',
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {historyQuery.isPending ? (
                  <p className="text-sm text-muted-foreground">{t('details.assignments.loading', 'Loading assignments...')}</p>
                ) : null}

                {historyQuery.isError ? (
                  <p className="text-sm text-destructive">{t('details.assignments.historyError', 'Unable to load checkout history right now.')}</p>
                ) : null}

                {historyQuery.isSuccess && activeCheckouts.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    <Laptop className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    {t('details.assignments.currentHoldingsEmpty', 'No assets currently assigned to this person.')}
                  </div>
                ) : null}

                {historyQuery.isSuccess && activeCheckouts.length > 0 ? (
                  <div className="space-y-3">
                    {activeCheckouts.map((checkout) => {
                      const asset = assetsMap.get(checkout.assetId)
                      const assetName = asset ? asset.name : `Asset ${checkout.assetId.slice(0, 8)}…`
                      const assetTag = asset ? asset.tag : undefined
                      const isOverdue =
                        checkout.expectedReturnDate !== null &&
                        new Date(checkout.expectedReturnDate).getTime() < nowTimestamp

                      return (
                        <div key={checkout.id} className="rounded-lg border border-border bg-card p-4 shadow-none">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                              <Laptop className="h-4 w-4 text-muted-foreground" />
                              <Link
                                to={`/app/assets/${checkout.assetId}`}
                                className="font-medium text-foreground hover:text-primary hover:underline"
                              >
                                {assetName}
                              </Link>
                              {assetTag ? (
                                <span className="font-mono text-xs text-muted-foreground">({assetTag})</span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              {isOverdue ? (
                                <Badge variant="warning">{t('details.assignments.overdue', 'Overdue')}</Badge>
                              ) : null}
                              <Badge variant="success">{t('details.assignments.active', 'Active')}</Badge>
                              {canAssign ? (
                                <CheckinDialog assetId={checkout.assetId} assetName={assetName} />
                              ) : null}
                            </div>
                          </div>

                          <div className="mt-3 grid gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {t('details.assignments.assignedDate', 'Assigned')}: {new Date(checkout.checkedOutAt).toLocaleDateString()}
                              </span>
                            </div>
                            {checkout.expectedReturnDate ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {t('details.assignments.expectedReturn', 'Expected return')}: {new Date(checkout.expectedReturnDate).toLocaleDateString()}
                                </span>
                              </div>
                            ) : null}
                          </div>

                          {checkout.notes ? (
                            <div className="mt-3 flex items-start gap-1.5 rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                              <Clipboard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span className="whitespace-pre-wrap">{checkout.notes}</span>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Past Returned History */}
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {t('details.assignments.pastHistory', 'Past Assignment History')}
                </CardTitle>
                <CardDescription>
                  {t(
                    'details.assignments.pastHistoryDescription',
                    'Timeline of previously assigned items that have been returned.',
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {historyQuery.isPending ? (
                  <p className="text-sm text-muted-foreground">{t('details.assignments.loading', 'Loading assignments...')}</p>
                ) : null}

                {historyQuery.isSuccess && pastCheckouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('details.assignments.pastHistoryEmpty', 'No returned assets in history yet.')}
                  </p>
                ) : null}

                {historyQuery.isSuccess && pastCheckouts.length > 0 ? (
                  <div className="relative ml-3 space-y-4 border-l border-border pl-6">
                    {pastCheckouts.map((checkout) => {
                      const asset = assetsMap.get(checkout.assetId)
                      const assetName = asset ? asset.name : `Asset ${checkout.assetId.slice(0, 8)}…`
                      const assetTag = asset ? asset.tag : undefined

                      return (
                        <div key={checkout.id} className="group relative pb-2">
                          <div className="absolute -left-[31px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-background transition-colors" />

                          <div className="rounded-lg border border-border bg-card p-4 shadow-none">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-2">
                                <Laptop className="h-4 w-4 text-muted-foreground" />
                                <Link
                                  to={`/app/assets/${checkout.assetId}`}
                                  className="font-medium text-foreground hover:text-primary hover:underline"
                                >
                                  {assetName}
                                </Link>
                                {assetTag ? (
                                  <span className="font-mono text-xs text-muted-foreground">({assetTag})</span>
                                ) : null}
                              </div>
                              <Badge variant="muted">{t('details.assignments.closed', 'Closed')}</Badge>
                            </div>

                            <div className="mt-3 grid gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {t('details.assignments.assignedDate', 'Assigned')}: {new Date(checkout.checkedOutAt).toLocaleDateString()}
                                </span>
                              </div>
                              {checkout.checkedInAt ? (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {t('details.assignments.unassignedDate', 'Unassigned')}: {new Date(checkout.checkedInAt).toLocaleDateString()}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {checkout.notes ? (
                              <div className="mt-3 flex items-start gap-1.5 rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                                <Clipboard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="whitespace-pre-wrap">{checkout.notes}</span>
                              </div>
                            ) : null}
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

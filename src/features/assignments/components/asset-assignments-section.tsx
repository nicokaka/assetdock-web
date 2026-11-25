import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAssetAssignmentsQuery,
  useUnassignAssetMutation,
} from '@/features/assignments/hooks/use-asset-assignments'
import { useAssetCheckoutsQuery } from '@/features/checkout/hooks/use-checkout-actions'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { canManageAssignments, canViewUsers } from '@/features/auth/utils/permissions'
import { useLocationsQuery } from '@/features/catalog/hooks/use-catalog-lookups'
import { useUsersQuery } from '@/features/users/hooks/use-user-lookup'
import { usePeopleQuery } from '@/features/people/hooks/use-people'
import { formatTimestamp } from '@/lib/format'
import { HttpError } from '@/lib/http-client'

type AssetAssignmentsSectionProps = {
  assetId: string
}

type UnifiedAssignmentEntry = {
  key: string
  source: 'checkout' | 'legacy'
  personId: string
  assignedAt: string
  unassignedAt: string | null
  expectedReturnDate: string | null
  assignedBy: string
  returnedBy: string | null
  locationId: string | null
  notes: string | null
}

export function AssetAssignmentsSection({ assetId }: AssetAssignmentsSectionProps) {
  const { t } = useTranslation()
  const [nowTimestamp] = useState(() => Date.now())
  const sessionQuery = useSessionQuery()
  const role = sessionQuery.data?.user.role
  const checkoutsQuery = useAssetCheckoutsQuery(assetId)
  const assignmentsQuery = useAssetAssignmentsQuery(assetId)
  const usersQuery = useUsersQuery({ enabled: canViewUsers(role) })
  const peopleQuery = usePeopleQuery()
  const locationsQuery = useLocationsQuery()
  const unassignMutation = useUnassignAssetMutation(assetId)

  const legacyAssignments = assignmentsQuery.data ?? []
  const locations = locationsQuery.data ?? []
  const activeLegacyAssignment = legacyAssignments.find(
    (assignment) => assignment.unassignedAt === null,
  )

  const unifiedHistory = useMemo<UnifiedAssignmentEntry[]>(() => {
    const checkoutEntries: UnifiedAssignmentEntry[] = (checkoutsQuery.data ?? []).map((checkout) => ({
      key: `checkout-${checkout.id}`,
      source: 'checkout',
      personId: checkout.personId,
      assignedAt: checkout.checkedOutAt,
      unassignedAt: checkout.checkedInAt,
      expectedReturnDate: checkout.expectedReturnDate,
      assignedBy: checkout.checkedOutBy,
      returnedBy: checkout.checkedInBy,
      locationId: null,
      notes: checkout.notes,
    }))

    const legacyEntries: UnifiedAssignmentEntry[] = (assignmentsQuery.data ?? []).map((assignment) => ({
      key: `legacy-${assignment.id}`,
      source: 'legacy',
      personId: assignment.personId,
      assignedAt: assignment.assignedAt,
      unassignedAt: assignment.unassignedAt,
      expectedReturnDate: null,
      assignedBy: assignment.assignedBy,
      returnedBy: null,
      locationId: assignment.locationId,
      notes: assignment.notes,
    }))

    return [...checkoutEntries, ...legacyEntries].sort(
      (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
    )
  }, [checkoutsQuery.data, assignmentsQuery.data])

  async function handleUnassign() {
    await unassignMutation.mutateAsync()
  }

  const unassignErrorMessage =
    unassignMutation.error instanceof HttpError && unassignMutation.error.status === 400
      ? t('details.assignments.unassignErrorData', 'Unable to unassign this asset in its current state.')
      : unassignMutation.isError
        ? t('details.assignments.unassignErrorGeneric', 'Unable to unassign this asset right now.')
        : undefined

  const isLoading = (checkoutsQuery.isPending || assignmentsQuery.isPending) && unifiedHistory.length === 0
  const isError = checkoutsQuery.isError && assignmentsQuery.isError
  const isReady = checkoutsQuery.isSuccess || assignmentsQuery.isSuccess

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-lg font-semibold tracking-tight">{t('details.assignments.title', 'Assignments')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('details.assignments.description', 'Assign this asset to a person and review the assignment history.')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeLegacyAssignment && canManageAssignments(role) ? (
          <div className="space-y-3 rounded-md border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t('details.assignments.activeMsg', 'There is an active assignment for this asset.')}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={unassignMutation.isPending}
                onClick={() => void handleUnassign()}
              >
                {unassignMutation.isPending ? t('details.assignments.removing', 'Removing...') : t('details.assignments.remove', 'Unassign')}
              </Button>
            </div>
            {unassignErrorMessage ? (
              <p className="text-sm text-destructive">{unassignErrorMessage}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">{t('details.assignments.history', 'History')}</h3>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t('details.assignments.loading', 'Loading assignments...')}</p>
          ) : null}

          {isError ? (
            <p className="text-sm text-destructive">{t('details.assignments.error', 'Unable to load assignments right now.')}</p>
          ) : null}

          {isReady && unifiedHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('details.assignments.empty', 'No assignments yet.')}</p>
          ) : null}

          {unifiedHistory.length > 0 ? (
            <div className="space-y-3">
              {unifiedHistory.map((entry) => {
                const assignee = (peopleQuery.data?.items ?? []).find((p) => p.id === entry.personId)
                const assigner = (usersQuery.data?.items ?? []).find((u) => u.id === entry.assignedBy)
                const returner = entry.returnedBy
                  ? (usersQuery.data?.items ?? []).find((u) => u.id === entry.returnedBy)
                  : undefined
                const assigneeName = assignee ? assignee.fullName : `Person ${entry.personId.slice(0, 8)}…`
                const assignerName = assigner ? assigner.fullName : `${entry.assignedBy.slice(0, 8)}…`
                const returnerName = returner
                  ? returner.fullName
                  : entry.returnedBy
                    ? `${entry.returnedBy.slice(0, 8)}…`
                    : null

                const location = entry.locationId
                  ? locations.find((l) => l.id === entry.locationId)
                  : undefined
                const locationName = location
                  ? location.name
                  : entry.locationId
                    ? `${entry.locationId.slice(0, 8)}…`
                    : null

                const isActive = entry.unassignedAt === null
                const isOverdue =
                  isActive &&
                  entry.expectedReturnDate !== null &&
                  new Date(entry.expectedReturnDate).getTime() < nowTimestamp

                return (
                  <div key={entry.key} className="rounded-md border border-border p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        to={`/app/people/${entry.personId}`}
                        className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {assigneeName}
                      </Link>
                      <div className="flex items-center gap-1.5">
                        {isOverdue ? (
                          <Badge variant="warning">{t('details.assignments.overdue', 'Overdue')}</Badge>
                        ) : null}
                        <Badge variant={isActive ? 'success' : 'muted'}>
                          {isActive ? t('details.assignments.active', 'Active') : t('details.assignments.closed', 'Closed')}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>{t('details.assignments.assignedDate', 'Assigned')}: {formatTimestamp(entry.assignedAt)}</p>
                      <p>{t('details.assignments.unassignedDate', 'Unassigned')}: {formatTimestamp(entry.unassignedAt)}</p>
                      {entry.expectedReturnDate ? (
                        <p>
                          {t('details.assignments.expectedReturn', 'Expected return')}: {new Date(entry.expectedReturnDate).toLocaleDateString()}
                        </p>
                      ) : null}
                      {locationName ? (
                        <p>{t('details.assignments.location', 'Location')}: {locationName}</p>
                      ) : null}
                      <p>{t('details.assignments.assignedBy', 'Assigned by')}: {assignerName}</p>
                      {returnerName ? (
                        <p>{t('details.assignments.returnedBy', 'Returned by')}: {returnerName}</p>
                      ) : null}
                    </div>
                    {entry.notes ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{entry.notes}</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

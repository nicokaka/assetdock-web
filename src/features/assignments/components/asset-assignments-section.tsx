import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAssetAssignmentsQuery,
  useUnassignAssetMutation,
} from '@/features/assignments/hooks/use-asset-assignments'
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

export function AssetAssignmentsSection({ assetId }: AssetAssignmentsSectionProps) {
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()
  const role = sessionQuery.data?.user.role
  const assignmentsQuery = useAssetAssignmentsQuery(assetId)
  const usersQuery = useUsersQuery({ enabled: canViewUsers(role) })
  const peopleQuery = usePeopleQuery()
  const locationsQuery = useLocationsQuery()
  const unassignMutation = useUnassignAssetMutation(assetId)

  const assignments = assignmentsQuery.data ?? []
  const locations = locationsQuery.data ?? []
  const activeAssignment = assignments.find((assignment) => assignment.unassignedAt === null)

  async function handleUnassign() {
    await unassignMutation.mutateAsync()
  }

  const unassignErrorMessage =
    unassignMutation.error instanceof HttpError && unassignMutation.error.status === 400
      ? t('details.assignments.unassignErrorData', 'Unable to unassign this asset in its current state.')
      : unassignMutation.isError
        ? t('details.assignments.unassignErrorGeneric', 'Unable to unassign this asset right now.')
        : undefined

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-lg font-semibold tracking-tight">{t('details.assignments.title', 'Assignments')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('details.assignments.description', 'Assign this asset to a user and review the assignment history.')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeAssignment && canManageAssignments(role) ? (
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

          {assignmentsQuery.isPending ? (
            <p className="text-sm text-muted-foreground">{t('details.assignments.loading', 'Loading assignments...')}</p>
          ) : null}

          {assignmentsQuery.isError ? (
            <p className="text-sm text-destructive">{t('details.assignments.error', 'Unable to load assignments right now.')}</p>
          ) : null}

          {assignmentsQuery.isSuccess && assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('details.assignments.empty', 'No assignments yet.')}</p>
          ) : null}

          {assignmentsQuery.isSuccess && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const assignee = (peopleQuery.data?.items ?? []).find(p => p.id === assignment.personId)
                const assigner = (usersQuery.data?.items ?? []).find(u => u.id === assignment.assignedBy)
                const assigneeName = assignee ? assignee.fullName : `Person ${assignment.personId.slice(0, 8)}…`
                const assignerName = assigner ? assigner.fullName : `${assignment.assignedBy.slice(0, 8)}…`

                const location = locations.find(l => l.id === assignment.locationId)
                const locationName = location ? location.name : assignment.locationId ? `${assignment.locationId.slice(0, 8)}…` : '—'

                return (
                  <div key={assignment.id} className="rounded-md border border-border p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {assigneeName}
                      </p>
                      <Badge variant={assignment.unassignedAt ? 'muted' : 'success'}>
                        {assignment.unassignedAt ? t('details.assignments.closed', 'Closed') : t('details.assignments.active', 'Active')}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>{t('details.assignments.assignedDate', 'Assigned')}: {formatTimestamp(assignment.assignedAt)}</p>
                      <p>{t('details.assignments.unassignedDate', 'Unassigned')}: {formatTimestamp(assignment.unassignedAt)}</p>
                      <p>{t('details.assignments.location', 'Location')}: {locationName}</p>
                      <p>{t('details.assignments.assignedBy', 'Assigned by')}: {assignerName}</p>
                    </div>
                    {assignment.notes ? (
                      <p className="mt-3 text-sm text-foreground">{assignment.notes}</p>
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

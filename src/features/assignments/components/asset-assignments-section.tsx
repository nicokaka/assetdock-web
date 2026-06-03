import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAssignAssetMutation,
  useAssetAssignmentsQuery,
  useUnassignAssetMutation,
} from '@/features/assignments/hooks/use-asset-assignments'
import { useLocationsQuery } from '@/features/catalog/hooks/use-catalog-lookups'
import { useUsersQuery } from '@/features/users/hooks/use-user-lookup'
import { usePeopleQuery } from '@/features/people/hooks/use-people'
import { formatTimestamp, getLookupStateMessage } from '@/lib/format'
import { HttpError } from '@/lib/http-client'

type AssetAssignmentsSectionProps = {
  assetId: string
}



export function AssetAssignmentsSection({ assetId }: AssetAssignmentsSectionProps) {
  const { t } = useTranslation()
  const [personId, setPersonId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [notes, setNotes] = useState('')
  const assignmentsQuery = useAssetAssignmentsQuery(assetId)
  const usersQuery = useUsersQuery()
  const peopleQuery = usePeopleQuery()
  const locationsQuery = useLocationsQuery()
  const assignMutation = useAssignAssetMutation(assetId)
  const unassignMutation = useUnassignAssetMutation(assetId)

  const assignments = assignmentsQuery.data ?? []
  const people = useMemo(
    () => (peopleQuery.data?.items ?? []).filter((person) => person.active),
    [peopleQuery.data],
  )
  const locations = useMemo(
    () => (locationsQuery.data ?? []).filter((location) => location.active),
    [locationsQuery.data],
  )
  const activeAssignment = assignments.find((assignment) => assignment.unassignedAt === null)

  async function handleAssignSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!personId) {
      return
    }

    await assignMutation.mutateAsync({
      personId,
      locationId: locationId || undefined,
      notes: notes || undefined,
    })

    setPersonId('')
    setLocationId('')
    setNotes('')
  }

  async function handleUnassign() {
    await unassignMutation.mutateAsync()
  }

  const assignErrorMessage =
    assignMutation.error instanceof HttpError && assignMutation.error.status === 400
      ? t('details.assignments.assignErrorData', 'Unable to assign the asset with the provided data.')
      : assignMutation.isError
        ? t('details.assignments.assignErrorGeneric', 'Unable to assign the asset right now.')
        : undefined

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
        <form className="space-y-4 rounded-md border border-border p-4" onSubmit={handleAssignSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-muted-foreground">{t('details.assignments.user', 'Person')}</span>
              <select
                value={personId}
                onChange={(event) => setPersonId(event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                disabled={assignMutation.isPending}
                required
              >
                <option value="">
                  {getLookupStateMessage(peopleQuery.isPending, peopleQuery.isError, t('details.assignments.selectUser', 'Select a person'))}
                </option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName} {person.email ? `(${person.email})` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-muted-foreground">{t('details.assignments.location', 'Location')}</span>
              <select
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                disabled={assignMutation.isPending}
              >
                <option value="">
                  {getLookupStateMessage(
                    locationsQuery.isPending,
                    locationsQuery.isError,
                    t('assetForm.placeholders.noLocation', 'No location'),
                  )}
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">{t('details.assignments.notes', 'Notes')}</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              disabled={assignMutation.isPending}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder={t('details.assignments.notesPlaceholder', 'Optional note')}
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {activeAssignment
                ? t('details.assignments.activeMsg', 'There is an active assignment for this asset.')
                : t('details.assignments.inactiveMsg', 'There is no active assignment for this asset.')}
            </p>
            <div className="flex gap-2">
              <Button type="submit" disabled={!personId || assignMutation.isPending}>
                {assignMutation.isPending ? t('details.assignments.assigning', 'Assigning...') : t('details.assignments.assign', 'Assign asset')}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!activeAssignment || unassignMutation.isPending}
                onClick={() => void handleUnassign()}
              >
                {unassignMutation.isPending ? t('details.assignments.removing', 'Removing...') : t('details.assignments.remove', 'Unassign')}
              </Button>
            </div>
          </div>

          {assignErrorMessage ? (
            <p className="text-sm text-destructive">{assignErrorMessage}</p>
          ) : null}
          {unassignErrorMessage ? (
            <p className="text-sm text-destructive">{unassignErrorMessage}</p>
          ) : null}
        </form>

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

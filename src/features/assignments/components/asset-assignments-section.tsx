import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAssignAssetMutation,
  useAssetAssignmentsQuery,
  useUnassignAssetMutation,
} from '@/features/assignments/hooks/use-asset-assignments'
import { useLocationsQuery } from '@/features/catalog/hooks/use-catalog-lookups'
import { useUsersQuery } from '@/features/users/hooks/use-user-lookup'
import { HttpError } from '@/lib/http-client'

type AssetAssignmentsSectionProps = {
  assetId: string
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Active'
  }

  return new Date(value).toLocaleString()
}

function getLookupStateMessage(isPending: boolean, isError: boolean, emptyLabel: string) {
  if (isPending) {
    return 'Loading...'
  }

  if (isError) {
    return 'Unavailable'
  }

  return emptyLabel
}

export function AssetAssignmentsSection({ assetId }: AssetAssignmentsSectionProps) {
  const [userId, setUserId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [notes, setNotes] = useState('')
  const assignmentsQuery = useAssetAssignmentsQuery(assetId)
  const usersQuery = useUsersQuery()
  const locationsQuery = useLocationsQuery()
  const assignMutation = useAssignAssetMutation(assetId)
  const unassignMutation = useUnassignAssetMutation(assetId)

  const assignments = assignmentsQuery.data ?? []
  const users = useMemo(
    () => (usersQuery.data ?? []).filter((user) => user.status === 'ACTIVE'),
    [usersQuery.data],
  )
  const locations = useMemo(
    () => (locationsQuery.data ?? []).filter((location) => location.active),
    [locationsQuery.data],
  )
  const activeAssignment = assignments.find((assignment) => assignment.unassignedAt === null)

  async function handleAssignSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!userId) {
      return
    }

    await assignMutation.mutateAsync({
      userId,
      locationId: locationId || undefined,
      notes: notes || undefined,
    })

    setUserId('')
    setLocationId('')
    setNotes('')
  }

  async function handleUnassign() {
    await unassignMutation.mutateAsync()
  }

  const assignErrorMessage =
    assignMutation.error instanceof HttpError && assignMutation.error.status === 400
      ? 'Unable to assign the asset with the provided data.'
      : assignMutation.isError
        ? 'Unable to assign the asset right now.'
        : undefined

  const unassignErrorMessage =
    unassignMutation.error instanceof HttpError && unassignMutation.error.status === 400
      ? 'Unable to unassign this asset in its current state.'
      : unassignMutation.isError
        ? 'Unable to unassign this asset right now.'
        : undefined

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="gap-1">
        <CardTitle className="text-lg font-semibold tracking-tight">Assignments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Assign this asset to a user and review the assignment history.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4 rounded-md border border-border p-4" onSubmit={handleAssignSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-muted-foreground">User</span>
              <select
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                disabled={assignMutation.isPending}
                required
              >
                <option value="">
                  {getLookupStateMessage(usersQuery.isPending, usersQuery.isError, 'Select a user')}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-muted-foreground">Location</span>
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
                    'No location',
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
            <span className="text-muted-foreground">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              disabled={assignMutation.isPending}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Optional note"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {activeAssignment
                ? 'There is an active assignment for this asset.'
                : 'There is no active assignment for this asset.'}
            </p>
            <div className="flex gap-2">
              <Button type="submit" disabled={!userId || assignMutation.isPending}>
                {assignMutation.isPending ? 'Assigning...' : 'Assign asset'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!activeAssignment || unassignMutation.isPending}
                onClick={() => void handleUnassign()}
              >
                {unassignMutation.isPending ? 'Removing...' : 'Unassign'}
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
          <h3 className="text-sm font-medium text-foreground">History</h3>

          {assignmentsQuery.isPending ? (
            <p className="text-sm text-muted-foreground">Loading assignments...</p>
          ) : null}

          {assignmentsQuery.isError ? (
            <p className="text-sm text-destructive">Unable to load assignments right now.</p>
          ) : null}

          {assignmentsQuery.isSuccess && assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assignments yet.</p>
          ) : null}

          {assignmentsQuery.isSuccess && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-foreground">
                      User {assignment.userId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.unassignedAt ? 'Closed' : 'Active'}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>Assigned: {formatTimestamp(assignment.assignedAt)}</p>
                    <p>Unassigned: {formatTimestamp(assignment.unassignedAt)}</p>
                    <p>Location: {assignment.locationId ?? 'Not provided'}</p>
                    <p>Assigned by: {assignment.assignedBy}</p>
                  </div>
                  {assignment.notes ? (
                    <p className="mt-3 text-sm text-foreground">{assignment.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

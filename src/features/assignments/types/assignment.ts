export type AssetAssignment = {
  id: string
  assetId: string
  personId: string
  locationId: string | null
  assignedAt: string
  unassignedAt: string | null
  assignedBy: string
  notes: string | null
  createdAt: string
}

export type AssignAssetInput = {
  personId: string
  locationId?: string
  notes?: string
}

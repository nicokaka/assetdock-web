export type AssetAssignment = {
  id: string
  assetId: string
  userId: string
  locationId: string | null
  assignedAt: string
  unassignedAt: string | null
  assignedBy: string
  notes: string | null
  createdAt: string
}

export type AssignAssetInput = {
  userId: string
  locationId?: string
  notes?: string
}

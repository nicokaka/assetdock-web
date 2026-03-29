export type AssetStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'IN_MAINTENANCE'
  | 'RETIRED'
  | 'LOST'

export type AssetListItem = {
  id: string
  assetTag: string
  displayName: string | null
  serialNumber: string | null
  status: AssetStatus
  archivedAt: string | null
}

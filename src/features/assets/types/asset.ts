export type AssetStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'IN_STOCK'
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

export type AssetDetail = {
  id: string
  assetTag: string
  displayName: string | null
  categoryId: string | null
  manufacturerId: string | null
  currentLocationId: string | null
  status: AssetStatus
  serialNumber: string | null
  hostname: string | null
  description: string | null
  archivedAt: string | null
}

export type CreateAssetInput = {
  assetTag: string
  displayName: string
  serialNumber?: string
  hostname?: string
  description?: string
  categoryId?: string
  manufacturerId?: string
  currentLocationId?: string
}

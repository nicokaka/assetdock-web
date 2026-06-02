export type AssetStatus =
  | 'ASSIGNED'
  | 'IN_STOCK'
  | 'IN_MAINTENANCE'
  | 'RETIRED'

export type AssetListItem = {
  id: string
  assetTag: string
  displayName: string | null
  serialNumber: string | null
  status: AssetStatus
  currentAssignedUserName: string | null
  archivedAt: string | null
}

export type AssetDetail = {
  id: string
  assetTag: string
  displayName: string | null
  categoryId: string | null
  manufacturerId: string | null
  currentLocationId: string | null
  currentAssignedUserId: string | null
  currentAssignedUserName: string | null
  status: AssetStatus
  serialNumber: string | null
  hostname: string | null
  description: string | null
  purchaseDate: string | null
  warrantyExpiryDate: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
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
  status?: AssetStatus
  purchaseDate?: string
  warrantyExpiryDate?: string
}

export type UpdateAssetInput = Partial<CreateAssetInput>

export type AssetPageView = {
  items: AssetListItem[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED'

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ASSET_MANAGER' | 'AUDITOR' | 'VIEWER'

export type UserSummary = {
  id: string
  organizationId: string
  fullName: string
  email: string
  status: UserStatus
  roles: UserRole[]
  createdAt: string
  updatedAt: string
}

export type UserDetail = UserSummary

export type UserLookupItem = Pick<UserSummary, 'id' | 'fullName' | 'email' | 'status'>

export type UserPageView = {
  items: UserSummary[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

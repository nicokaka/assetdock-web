export type UserLookupItem = {
  id: string
  fullName: string
  email: string
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED'
}

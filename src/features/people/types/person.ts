export type PersonSummary = {
  id: string
  organizationId: string
  fullName: string
  email?: string
  department?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type PersonDetail = PersonSummary

export type PersonPageView = {
  items: PersonSummary[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type PersonCheckout = {
  id: string
  assetId: string
  personId: string
  checkedOutAt: string
  expectedReturnDate: string | null
  checkedInAt: string | null
  checkedOutBy: string
  checkedInBy: string | null
  notes: string | null
}


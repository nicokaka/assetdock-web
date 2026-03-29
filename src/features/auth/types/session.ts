export type AuthenticatedUser = {
  id: string
  fullName: string
  email: string
  role: string
  organizationId: string
}

export type SessionResponse = {
  user: AuthenticatedUser
}

export type SetupStatusResponse = {
  configured: boolean
}

export type SetupRequest = {
  organizationName: string
  adminFullName: string
  adminEmail: string
  adminPassword: string
}

export type SetupResponse = {
  organization: {
    id: string
    name: string
  }
  admin: {
    id: string
    email: string
    fullName: string
  }
}

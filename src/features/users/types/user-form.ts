import { z } from 'zod'

import type { UserRole, UserStatus } from '@/features/users/types/user'

export const userRoleOptions: UserRole[] = [
  'ORG_ADMIN',
  'ASSET_MANAGER',
  'AUDITOR',
  'VIEWER',
]

export const userStatusOptions: UserStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'LOCKED',
]

export const userFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  roles: z.array(z.enum(userRoleOptions)).min(1, 'Select at least one role.'),
  status: z.enum(userStatusOptions),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export type CreateUserInput = {
  fullName: string
  email: string
  password: string
  roles: UserRole[]
  status: UserStatus
}

// ────────────────────────────────────────────────
// Edit form (no password field)
// ────────────────────────────────────────────────

export const userEditFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.email('Enter a valid email address.'),
  roles: z.array(z.enum(userRoleOptions)).min(1, 'Select at least one role.'),
  status: z.enum(userStatusOptions),
})

export type UserEditFormValues = z.infer<typeof userEditFormSchema>

export type UpdateUserProfileInput = {
  fullName: string
  email: string
}

export function toUpdateUserProfileInput(values: UserEditFormValues): UpdateUserProfileInput {
  return {
    fullName: values.fullName,
    email: values.email,
  }
}

// ────────────────────────────────────────────────
// Create form
// ────────────────────────────────────────────────

export function toCreateUserInput(values: UserFormValues): CreateUserInput {
  return {
    fullName: values.fullName,
    email: values.email,
    password: values.password,
    roles: values.roles,
    status: values.status,
  }
}

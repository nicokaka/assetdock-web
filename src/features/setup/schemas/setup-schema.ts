import { z } from 'zod'

// Password rules mirror the backend @ValidPassword annotation:
// min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.')

export const setupSchema = z.object({
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters.')
    .max(200, 'Organization name must be at most 200 characters.'),
  adminFullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters.')
    .max(200, 'Full name must be at most 200 characters.'),
  adminEmail: z.email('Enter a valid email address.'),
  adminPassword: passwordSchema,
})

export type SetupInput = z.infer<typeof setupSchema>

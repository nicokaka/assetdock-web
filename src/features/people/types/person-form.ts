import { z } from 'zod'

export const personFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.union([z.string().trim().email('Enter a valid email address.'), z.literal('')]).optional(),
  department: z.string().trim().optional(),
  active: z.boolean(),
})

export type PersonFormValues = z.infer<typeof personFormSchema>

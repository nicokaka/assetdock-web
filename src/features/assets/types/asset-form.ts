import { z } from 'zod'

import type { CreateAssetInput } from '@/features/assets/types/asset'

const optionalUuidField = z.union([z.uuid('Select a valid option.'), z.literal('')])

export const assetFormSchema = z.object({
  assetTag: z.string().trim().min(1, 'Asset tag is required.'),
  displayName: z.string().trim().min(1, 'Display name is required.'),
  serialNumber: z.string().trim().optional(),
  hostname: z.string().trim().optional(),
  description: z.string().trim().optional(),
  categoryId: optionalUuidField,
  manufacturerId: optionalUuidField,
  currentLocationId: optionalUuidField,
})

export type AssetFormValues = z.infer<typeof assetFormSchema>

export function toAssetInput(values: AssetFormValues): CreateAssetInput {
  return {
    assetTag: values.assetTag,
    displayName: values.displayName,
    serialNumber: values.serialNumber || undefined,
    hostname: values.hostname || undefined,
    description: values.description || undefined,
    categoryId: values.categoryId || undefined,
    manufacturerId: values.manufacturerId || undefined,
    currentLocationId: values.currentLocationId || undefined,
  }
}

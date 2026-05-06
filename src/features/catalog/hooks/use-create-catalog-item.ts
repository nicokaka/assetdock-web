import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { createCategory } from '@/features/catalog/api/create-category'
import { createManufacturer } from '@/features/catalog/api/create-manufacturer'
import { createLocation } from '@/features/catalog/api/create-location'

export type CatalogType = 'category' | 'manufacturer' | 'location'

export function useCreateCatalogItemMutation(type: CatalogType) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      switch (type) {
        case 'category':
          return createCategory(name, description)
        case 'manufacturer':
          return createManufacturer(name, description)
        case 'location':
          return createLocation(name, description)
      }
    },
    onSuccess: () => {
      // Invalidate the specific lookup query
      const queryKey = type === 'category' ? ['catalog', 'categories'] : type === 'manufacturer' ? ['catalog', 'manufacturers'] : ['catalog', 'locations']
      queryClient.invalidateQueries({ queryKey })
      toast.success(t('catalog.createSuccess', 'Item created successfully'))
    },
    onError: () => {
      toast.error(t('catalog.createError', 'Failed to create item'))
    },
  })
}

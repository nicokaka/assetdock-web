import { useQuery } from '@tanstack/react-query'

import { listCategories } from '@/features/catalog/api/list-categories'
import { listLocations } from '@/features/catalog/api/list-locations'
import { listManufacturers } from '@/features/catalog/api/list-manufacturers'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useManufacturersQuery() {
  return useQuery({
    queryKey: ['catalog', 'manufacturers'],
    queryFn: listManufacturers,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLocationsQuery() {
  return useQuery({
    queryKey: ['catalog', 'locations'],
    queryFn: listLocations,
    staleTime: 5 * 60 * 1000,
  })
}

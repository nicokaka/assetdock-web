import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { createPerson, type CreatePersonInput } from '@/features/people/api/create-person'
import { getPerson } from '@/features/people/api/get-person'
import { listPeople, type PersonListFilters } from '@/features/people/api/list-people'
import { updatePerson, type UpdatePersonInput } from '@/features/people/api/update-person'
import { deletePerson } from '@/features/people/api/delete-person'
import { getPersonHistory } from '@/features/people/api/get-person-history'

export function usePeopleListQuery(filters?: PersonListFilters) {
  return useQuery({
    queryKey: ['people', 'list', filters],
    queryFn: () => listPeople(filters),
  })
}

export function usePersonDetailQuery(personId: string) {
  return useQuery({
    queryKey: ['people', 'detail', personId],
    queryFn: () => getPerson(personId),
    enabled: Boolean(personId),
  })
}

export function usePeopleQuery() {
  return useQuery({
    queryKey: ['people', 'lookup'],
    queryFn: () => listPeople({ size: 100, active: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreatePersonMutation() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: CreatePersonInput) => createPerson(input),
    onSuccess: (person) => {
      void queryClient.invalidateQueries({ queryKey: ['people'] })
      queryClient.setQueryData(['people', 'detail', person.id], person)
      toast.success(t('toast.person.createSuccess', 'Person created successfully'))
    },
    onError: () => {
      toast.error(t('toast.person.createError', 'Failed to create person'))
    },
  })
}

export function useUpdatePersonMutation() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: UpdatePersonInput & { id: string }) => updatePerson(input),
    onSuccess: (person) => {
      void queryClient.invalidateQueries({ queryKey: ['people'] })
      queryClient.setQueryData(['people', 'detail', person.id], person)
      toast.success(t('toast.person.updateSuccess', 'Person updated successfully'))
    },
    onError: () => {
      toast.error(t('toast.person.updateError', 'Failed to update person'))
    },
  })
}

export function useDeletePersonMutation() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => deletePerson(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people'] })
      toast.success(t('toast.person.deleteSuccess', 'Person deleted successfully'))
    },
    onError: () => {
      toast.error(t('toast.person.deleteError', 'Failed to delete person'))
    },
  })
}

export function usePersonHistoryQuery(personId: string) {
  return useQuery({
    queryKey: ['people', 'history', personId],
    queryFn: () => getPersonHistory(personId),
    enabled: Boolean(personId),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { postSetup } from '@/features/setup/api/setup-api'
import { setupStatusQueryKey } from '@/features/setup/hooks/use-setup-status'
import type { SetupInput } from '@/features/setup/schemas/setup-schema'

export function useSetup() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: SetupInput) => postSetup(data),
    onSuccess: () => {
      // Invalidate the setup status so any subsequent guard check reflects the new state.
      queryClient.invalidateQueries({ queryKey: setupStatusQueryKey })
      toast.success('System configured successfully. You can now sign in.')
      navigate('/login', { replace: true })
    },
  })
}

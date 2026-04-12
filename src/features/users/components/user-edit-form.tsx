import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type UserEditFormValues,
  userEditFormSchema,
  userRoleOptions,
  userStatusOptions,
} from '@/features/users/types/user-form'
import { userRoleLabels, userStatusLabels } from '@/features/users/constants/labels'



type UserEditFormProps = {
  defaultValues: UserEditFormValues
  isPending: boolean
  errorMessage?: string
  onSubmit: (values: UserEditFormValues) => Promise<void>
}

export function UserEditForm({
  defaultValues,
  isPending,
  errorMessage,
  onSubmit,
}: UserEditFormProps) {
  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoComplete="email" placeholder="jane@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <FormControl>
                <select
                  multiple
                  value={field.value}
                  onChange={(event) => {
                    const values = Array.from(event.target.selectedOptions, (option) => option.value)
                    field.onChange(values)
                  }}
                  className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {userRoleOptions.map((role) => (
                    <option key={role} value={role}>
                      {userRoleLabels[role] ?? role}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {userStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {userStatusLabels[status] ?? status}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </Form>
  )
}

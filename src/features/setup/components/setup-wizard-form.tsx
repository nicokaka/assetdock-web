import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { HttpError } from '@/lib/http-client'
import { useSetup } from '@/features/setup/hooks/use-setup'
import { type SetupInput, setupSchema } from '@/features/setup/schemas/setup-schema'
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
import { PasswordStrengthIndicator } from '@/features/setup/components/password-strength-indicator'

export function SetupWizardForm() {
  const setupMutation = useSetup()

  const form = useForm<SetupInput>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      organizationName: '',
      adminFullName: '',
      adminEmail: '',
      adminPassword: '',
    },
  })

  const password = useWatch({ control: form.control, name: 'adminPassword' })

  async function onSubmit(values: SetupInput) {
    form.clearErrors('root')

    try {
      await setupMutation.mutateAsync(values)
    } catch (error) {
      const message =
        error instanceof HttpError && error.status === 409
          ? 'This system is already configured. Please sign in.'
          : 'Setup failed. Please check your input and try again.'

      form.setError('root', { message })
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="organization"
                  placeholder="Acme Corp"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adminFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator full name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Jane Smith"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adminEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adminPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  {...field}
                />
              </FormControl>
              <PasswordStrengthIndicator password={password} />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <Button
          className="w-full"
          type="submit"
          disabled={setupMutation.isPending}
        >
          {setupMutation.isPending ? 'Configuring system...' : 'Configure and get started'}
        </Button>
      </form>
    </Form>
  )
}

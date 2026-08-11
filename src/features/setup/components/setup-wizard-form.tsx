import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      if (error instanceof HttpError) {
        if (error.status === 409) {
          form.setError('root', {
            message: t('setup.errorConflict', 'Este sistema já está configurado. Faça login.'),
          })
          return
        }

        if (error.status === 429) {
          form.setError('root', {
            message: t('setup.errorThrottle', 'Muitas tentativas em pouco tempo. Por favor, aguarde 1 minuto e tente novamente.'),
          })
          return
        }

        const body = error.body as { detail?: string; title?: string; violations?: { field: string; message: string }[] } | undefined

        if (error.status === 400 && body?.violations?.length) {
          const fieldMap: Record<string, keyof SetupInput> = {
            organizationName: 'organizationName',
            adminFullName: 'adminFullName',
            adminEmail: 'adminEmail',
            adminPassword: 'adminPassword',
          }
          let mapped = false
          for (const v of body.violations) {
            const field = fieldMap[v.field]
            if (field) {
              form.setError(field, { message: v.message })
              mapped = true
            }
          }
          if (mapped) return
        }

        if (body?.detail) {
          form.setError('root', { message: body.detail })
          return
        }
      }

      form.setError('root', {
        message: t('setup.errorGeneric', 'Não foi possível concluir a configuração. Verifique os dados digitados e tente novamente.'),
      })
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
              <FormLabel>{t('setup.labels.organizationName', 'Organization name')}</FormLabel>
              <FormControl>
                <Input
                  autoComplete="organization"
                  placeholder={t('setup.placeholders.organizationName', 'Acme Corp')}
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
              <FormLabel>{t('setup.labels.adminFullName', 'Administrator full name')}</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder={t('setup.placeholders.adminFullName', 'Jane Smith')}
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
              <FormLabel>{t('setup.labels.adminEmail', 'Administrator email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t('setup.placeholders.adminEmail', 'admin@company.com')}
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
              <FormLabel>{t('setup.labels.adminPassword', 'Administrator password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('setup.placeholders.adminPassword', 'Create a strong password')}
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
          {setupMutation.isPending ? t('setup.submitting', 'Configuring system...') : t('setup.submit', 'Configure and get started')}
        </Button>
      </form>
    </Form>
  )
}

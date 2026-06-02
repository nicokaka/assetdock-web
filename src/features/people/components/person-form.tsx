import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { type PersonFormValues, personFormSchema } from '@/features/people/types/person-form'

type PersonFormProps = {
  defaultValues: PersonFormValues
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  errorMessage?: string
  onSubmit: (values: PersonFormValues) => Promise<void>
}

export function PersonForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onSubmit,
}: PersonFormProps) {
  const { t } = useTranslation()
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
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
              <FormLabel>{t('personForm.labels.fullName', 'Full name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('personForm.placeholders.fullName', 'e.g. Jane Smith')} {...field} />
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
              <FormLabel>{t('personForm.labels.email', 'Email (Optional)')}</FormLabel>
              <FormControl>
                <Input autoComplete="email" placeholder={t('personForm.placeholders.email', 'jane@company.com')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('personForm.labels.department', 'Department (Optional)')}</FormLabel>
              <FormControl>
                <Input placeholder={t('personForm.placeholders.department', 'e.g. Engineering')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('personForm.labels.status', 'Status')}</FormLabel>
              <FormControl>
                <select
                  value={field.value ? 'true' : 'false'}
                  onChange={(event) => {
                    field.onChange(event.target.value === 'true')
                  }}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="true">{t('personForm.status.active', 'Active')}</option>
                  <option value="false">{t('personForm.status.inactive', 'Inactive')}</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </form>
    </Form>
  )
}

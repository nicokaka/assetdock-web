import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonForm } from '@/features/people/components/person-form'
import { useCreatePersonMutation } from '@/features/people/hooks/use-people'
import type { PersonFormValues } from '@/features/people/types/person-form'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function PersonCreatePage() {
  usePageTitle(useTranslation().t('personForm.titleNew', 'New Person'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const createPersonMutation = useCreatePersonMutation()

  async function handleSubmit(values: PersonFormValues) {
    const person = await createPersonMutation.mutateAsync({
      fullName: values.fullName,
      email: values.email || undefined,
      department: values.department || undefined,
      active: values.active,
    })
    navigate(`/app/people/${person.id}`, { replace: true })
  }

  const errorMessage =
    createPersonMutation.error instanceof HttpError && createPersonMutation.error.status === 400
      ? t('personForm.errorNew', 'Unable to create the person with the provided data.')
      : createPersonMutation.isError
        ? t('personForm.errorGeneric', 'Unable to create the person right now.')
        : undefined

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.people', 'People'), href: '/app/people' },
            { label: t('personForm.titleNew', 'New Person') },
          ]}
        />
        <button onClick={() => navigate('/app/people')} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {t('personForm.back', 'Back to people')}
        </button>
      </div>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('personForm.titleNew', 'New Person')}
          </CardTitle>
          <CardDescription>
            {t('personForm.descriptionNew', 'Create a new employee/person to allow assigning assets to them.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonForm
            defaultValues={{
              fullName: '',
              email: '',
              department: '',
              active: true,
            }}
            submitLabel={t('personForm.submitNew', 'Create person')}
            pendingLabel={t('personForm.submittingNew', 'Creating...')}
            isPending={createPersonMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </section>
  )
}

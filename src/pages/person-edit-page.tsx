import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonForm } from '@/features/people/components/person-form'
import { usePersonDetailQuery, useUpdatePersonMutation } from '@/features/people/hooks/use-people'
import type { PersonFormValues } from '@/features/people/types/person-form'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function PersonEditPage() {
  usePageTitle(useTranslation().t('personForm.titleEdit', 'Edit Person'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { personId = '' } = useParams()
  const personQuery = usePersonDetailQuery(personId)
  const updatePersonMutation = useUpdatePersonMutation()

  const personLabel = personQuery.data?.fullName || t('breadcrumb.person', 'Person')

  const errorMessage =
    updatePersonMutation.error instanceof HttpError && updatePersonMutation.error.status === 400
      ? t('personForm.errorEdit', 'Unable to save the person with the provided data.')
      : updatePersonMutation.isError
        ? t('personForm.errorGeneric', 'Unable to save the person right now.')
        : undefined

  async function handleSubmit(values: PersonFormValues) {
    await updatePersonMutation.mutateAsync({
      id: personId,
      fullName: values.fullName,
      email: values.email || undefined,
      department: values.department || undefined,
      active: values.active,
    })
    navigate(`/app/people/${personId}`, { replace: true })
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.people', 'People'), href: '/app/people' },
            { label: personLabel, href: `/app/people/${personId}` },
            { label: t('personForm.titleEdit', 'Edit') },
          ]}
        />
        <button onClick={() => navigate(`/app/people/${personId}`)} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {t('personForm.back', 'Back to person')}
        </button>
      </div>

      {personQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('common.loading', 'Loading person...')}
          </CardContent>
        </Card>
      ) : null}

      {personQuery.isError ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">{t('personForm.errorTitle', 'Unable to load person')}</CardTitle>
            <CardDescription>
              {t('personForm.errorDescription', 'Please refresh the page or try again in a moment.')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {personQuery.isSuccess ? (
        <Card className="max-w-2xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {t('personForm.titleEdit', 'Edit Person')}
            </CardTitle>
            <CardDescription>
              {t('personForm.descriptionEdit', 'Update the employee/person details.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonForm
              defaultValues={{
                fullName: personQuery.data.fullName,
                email: personQuery.data.email || '',
                department: personQuery.data.department || '',
                active: personQuery.data.active,
              }}
              submitLabel={t('personForm.submitEdit', 'Save changes')}
              pendingLabel={t('personForm.submittingEdit', 'Saving...')}
              isPending={updatePersonMutation.isPending}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}

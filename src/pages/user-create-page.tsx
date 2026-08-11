import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/features/users/components/user-form'
import { useCreateUserMutation } from '@/features/users/hooks/use-create-user'
import { toCreateUserInput, type UserFormValues } from '@/features/users/types/user-form'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function UserCreatePage() {
  usePageTitle(useTranslation().t('userForm.titleNew', 'New User'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const createUserMutation = useCreateUserMutation()

  async function handleSubmit(values: UserFormValues) {
    const user = await createUserMutation.mutateAsync(toCreateUserInput(values))
    navigate(`/app/users/${user.id}`, { replace: true })
  }

  let errorMessage: string | undefined = undefined

  if (createUserMutation.error instanceof HttpError) {
    const err = createUserMutation.error
    if (err.status === 409) {
      errorMessage = t('userForm.errorDuplicateEmail', 'Este endereço de e-mail já está cadastrado para outro usuário na sua organização.')
    } else if (err.status === 400) {
      const body = err.body as { detail?: string; violations?: Array<{ message?: string }> } | undefined
      const violationMsg = body?.violations?.[0]?.message
      if (violationMsg) {
        errorMessage = violationMsg
      } else if (body?.detail) {
        errorMessage = t('userForm.errorValidationDetail', 'Dados inválidos: {{detail}}', { detail: body.detail })
      } else {
        errorMessage = t('userForm.errorPasswordRequirements', 'A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, letra minúscula, número e caractere especial (ex: Senha123!).')
      }
    } else {
      errorMessage = t('userForm.errorGeneric', 'Não foi possível processar a requisição no momento.')
    }
  } else if (createUserMutation.isError) {
    errorMessage = t('userForm.errorGeneric', 'Não foi possível processar a requisição no momento.')
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('app.header.users', 'Users'), href: '/app/users' },
            { label: t('userForm.titleNew', 'New User') },
          ]}
        />
        <button onClick={() => navigate('/app/users')} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          {t('userForm.back', 'Back to users')}
        </button>
      </div>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('userForm.titleNew', 'New User')}
          </CardTitle>
          <CardDescription>
            {t('userForm.descriptionNew', 'Create a new user with the core fields currently supported in the web app.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            defaultValues={{
              fullName: '',
              email: '',
              password: '',
              roles: ['VIEWER'],
              status: 'ACTIVE',
            }}
            submitLabel={t('userForm.submitNew', 'Create user')}
            pendingLabel={t('userForm.submittingNew', 'Creating...')}
            isPending={createUserMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </section>
  )
}

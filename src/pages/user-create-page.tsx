import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/features/users/components/user-form'
import { useCreateUserMutation } from '@/features/users/hooks/use-create-user'
import { toCreateUserInput, type UserFormValues } from '@/features/users/types/user-form'
import { HttpError } from '@/lib/http-client'

export function UserCreatePage() {
  const navigate = useNavigate()
  const createUserMutation = useCreateUserMutation()

  async function handleSubmit(values: UserFormValues) {
    const user = await createUserMutation.mutateAsync(toCreateUserInput(values))
    navigate(`/app/users/${user.id}`, { replace: true })
  }

  const errorMessage =
    createUserMutation.error instanceof HttpError && createUserMutation.error.status === 400
      ? 'Unable to create the user with the provided data.'
      : createUserMutation.isError
        ? 'Unable to create the user right now.'
        : undefined

  return (
    <section className="space-y-6">
      <div>
        <Button asChild variant="outline">
          <Link to="/app/users">Back to users</Link>
        </Button>
      </div>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            New User
          </CardTitle>
          <CardDescription>
            Create a new user with the core fields currently supported in the web app.
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
            submitLabel="Create user"
            pendingLabel="Creating..."
            isPending={createUserMutation.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </section>
  )
}

import { Link, useParams } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserDetailView } from '@/features/users/components/user-detail-view'
import { useUserDetailQuery } from '@/features/users/hooks/use-users'
import { HttpError } from '@/lib/http-client'

export function UserDetailPage() {
  const { userId = '' } = useParams()
  const userQuery = useUserDetailQuery(userId)

  const isNotFound =
    userQuery.isError &&
    userQuery.error instanceof HttpError &&
    userQuery.error.status === 404

  return (
    <section className="space-y-6">
      <div>
        <Link to="/app/users" className={buttonVariants({ variant: 'outline' })}>
          Back to users
        </Link>
      </div>

      {userQuery.isPending ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Loading user</CardTitle>
            <CardDescription>
              Fetching the latest user details.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">User not found</CardTitle>
            <CardDescription>
              The requested user is unavailable for the current session.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {userQuery.isError && !isNotFound ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unable to load user</CardTitle>
            <CardDescription>
              Please refresh the page or try again in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {userQuery.isSuccess ? <UserDetailView user={userQuery.data} /> : null}
    </section>
  )
}

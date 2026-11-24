import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <Card className="w-full border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('notFound.title', 'Page not found')}
          </CardTitle>
          <CardDescription>
            {t('notFound.description', 'The page you requested does not exist or has been moved.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/app" className={buttonVariants({ variant: 'default', size: 'sm' })}>
            {t('notFound.backHome', 'Go to dashboard')}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

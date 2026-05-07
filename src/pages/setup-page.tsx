import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SetupWizardForm } from '@/features/setup/components/setup-wizard-form'
import { usePageTitle } from '@/hooks/use-page-title'

export function SetupPage() {
  usePageTitle(useTranslation().t('setup.title', 'Welcome to AssetDock'))
  const { t } = useTranslation()

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-tight text-muted-foreground">
          {t('setup.subtitle', 'Initial system configuration')}
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t('setup.title', 'Welcome to AssetDock')}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {t('setup.description', 'This is the first time AssetDock has started. Create your organization and the initial administrator account to get started. This wizard runs only once.')}
          </p>
        </div>
      </div>

      <Card className="w-full border-border/80 bg-card/92 shadow-md backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {t('setup.cardTitle', 'Create your organization')}
          </CardTitle>
          <CardDescription className="leading-6">
            {t('setup.cardDescription', 'Set up the organization name and the administrator credentials that will be used to manage the platform.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetupWizardForm />
        </CardContent>
      </Card>
    </section>
  )
}

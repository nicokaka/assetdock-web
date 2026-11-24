import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImportJobSummary } from '@/features/imports/components/import-job-summary'
import { useImportAssetsCsvMutation, useImportJobQuery } from '@/features/imports/hooks/use-imports'
import { useSessionQuery } from '@/features/auth/hooks/use-session'
import { canImportAssets } from '@/features/auth/utils/permissions'
import { HttpError } from '@/lib/http-client'
import { usePageTitle } from '@/hooks/use-page-title'

export function ImportsPage() {
  usePageTitle(useTranslation().t('imports.title', 'Imports'))
  const { t } = useTranslation()
  const sessionQuery = useSessionQuery()
  const canUpload = canImportAssets(sessionQuery.data?.user.role)
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const uploadMutation = useImportAssetsCsvMutation()
  const importJobQuery = useImportJobQuery(jobId)

  const currentJob = importJobQuery.data ?? uploadMutation.data

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file || !canUpload) {
      return
    }

    try {
      const job = await uploadMutation.mutateAsync(file)
      setJobId(job.id)
    } catch {
      // error state handled via uploadMutation.error
    }
  }

  function getUploadErrorMessage(error: unknown): string {
    if (error instanceof HttpError) {
      if (error.status === 413) {
        return t('imports.errorTooLarge', 'The uploaded CSV exceeds the maximum allowed file size.')
      }
      if (error.status === 429) {
        return t('imports.errorRateLimit', 'Too many import requests. Please wait a moment and try again.')
      }
      if (error.message) {
        return error.message
      }
    }
    return t('imports.errorTitle', 'Unable to upload the CSV right now.')
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('imports.title', 'Imports')}
        description={t('imports.description', 'Upload a CSV file and review the resulting import job.')}
      />

      <Card className="max-w-2xl border-border/80 bg-card/78 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">{t('imports.dropzone.title', 'CSV import')}</CardTitle>
          <CardDescription>
            {t('imports.dropzone.description', 'Select a single CSV file to create an asset import job.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canUpload ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-lg border border-dashed border-border/80 bg-background/80 px-3 py-3 text-sm text-muted-foreground transition-colors duration-200 file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:text-foreground hover:border-border"
              />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!file || uploadMutation.isPending}>
                  {uploadMutation.isPending ? t('imports.dropzone.uploading', 'Uploading...') : t('imports.newImport', 'Upload CSV')}
                </Button>
                {jobId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => importJobQuery.refetch()}
                    disabled={importJobQuery.isFetching}
                  >
                    {importJobQuery.isFetching
                      ? t('imports.refreshingJob', 'Refreshing...')
                      : t('imports.refreshJob', 'Refresh status')}
                  </Button>
                ) : null}
              </div>

              {file ? (
                <p className="text-sm text-muted-foreground">
                  {t('imports.table.filename', 'Selected file')}: {file.name}
                </p>
              ) : null}
            </form>
          ) : null}

          {canUpload && !file && !uploadMutation.isPending && !uploadMutation.isError && !currentJob ? (
            <p className="text-sm text-muted-foreground">
              {t('imports.emptyDescription', 'Select a CSV file to start an import.')}
            </p>
          ) : null}

          {uploadMutation.isError ? (
            <p className="text-sm text-destructive">
              {getUploadErrorMessage(uploadMutation.error)}
            </p>
          ) : null}

          {currentJob ? <ImportJobSummary job={currentJob} /> : null}
        </CardContent>
      </Card>
    </section>
  )
}

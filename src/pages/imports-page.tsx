import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImportJobSummary } from '@/features/imports/components/import-job-summary'
import { useImportAssetsCsvMutation, useImportJobQuery } from '@/features/imports/hooks/use-imports'

export function ImportsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const uploadMutation = useImportAssetsCsvMutation()
  const importJobQuery = useImportJobQuery(jobId)

  const currentJob = importJobQuery.data ?? uploadMutation.data

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file) {
      return
    }

    const job = await uploadMutation.mutateAsync(file)
    setJobId(job.id)
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Imports</h1>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file and review the resulting import job.
        </p>
      </header>

      <Card className="max-w-2xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">CSV import</CardTitle>
          <CardDescription>
            Select a single CSV file to create an asset import job.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:text-foreground"
            />
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!file || uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Uploading...' : 'Upload CSV'}
              </Button>
              {jobId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => importJobQuery.refetch()}
                  disabled={importJobQuery.isFetching}
                >
                  {importJobQuery.isFetching ? 'Loading job...' : 'Load latest job'}
                </Button>
              ) : null}
            </div>

            {file ? (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name}
              </p>
            ) : null}
          </form>

          {!file && !uploadMutation.isPending && !uploadMutation.isError && !currentJob ? (
            <p className="text-sm text-muted-foreground">
              Select a CSV file to start an import.
            </p>
          ) : null}

          {uploadMutation.isError ? (
            <p className="text-sm text-destructive">
              Unable to upload the CSV right now.
            </p>
          ) : null}

          {currentJob ? <ImportJobSummary job={currentJob} /> : null}
        </CardContent>
      </Card>
    </section>
  )
}

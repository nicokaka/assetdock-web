export function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  return new Date(value).toLocaleString()
}

export function getLookupStateMessage(isPending: boolean, isError: boolean, emptyLabel: string) {
  if (isPending) {
    return 'Loading...'
  }

  if (isError) {
    return 'Unavailable'
  }

  return emptyLabel
}

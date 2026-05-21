export function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  return new Date(value).toLocaleString()
}

export function getLookupStateMessage(
  isPending: boolean,
  isError: boolean,
  emptyLabel: string,
  t?: (key: string, fallback: string) => string,
) {
  if (isPending) {
    return t ? t('common.loading', 'Loading...') : 'Loading...'
  }

  if (isError) {
    return t ? t('common.unavailable', 'Unavailable') : 'Unavailable'
  }

  return emptyLabel
}

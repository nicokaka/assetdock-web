export const CHUNK_RELOAD_TS_KEY = 'assetdock:chunk-reload-ts'

const CHUNK_RELOAD_COOLDOWN_MS = 15_000

const DYNAMIC_IMPORT_ERROR_PATTERNS = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
] as const

export function isDynamicImportError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : ''

  if (!message) {
    return false
  }

  return DYNAMIC_IMPORT_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
}

export function reloadOnceForChunkError(): boolean {
  try {
    const now = Date.now()
    const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_TS_KEY) ?? '0')
    if (Number.isFinite(lastReload) && now - lastReload <= CHUNK_RELOAD_COOLDOWN_MS) {
      return false
    }
    sessionStorage.setItem(CHUNK_RELOAD_TS_KEY, String(now))
    window.location.reload()
    return true
  } catch {
    return false
  }
}

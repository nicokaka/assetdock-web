type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  responseType?: 'json' | 'text' | 'blob'
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

function getCookie(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))

  return match ? decodeURIComponent(match[1]) : null
}

function shouldIncludeJsonContentType(body: unknown, headers: Headers) {
  return body !== undefined && !isFormData(body) && !headers.has('Content-Type')
}

function isJsonContentType(contentType: string | null) {
  if (!contentType) return false
  const normalized = contentType.toLowerCase()
  return normalized.includes('application/json') || normalized.includes('+json')
}

function shouldAttachCsrfToken(method: HttpMethod, path: string) {
  const isMutate = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
  if (!isMutate) return false

  // Public unauthenticated endpoints do not require CSRF cookies (none are set yet)
  if (path.includes('/login') || path.includes('/setup')) {
    return false
  }

  return true
}

export class HttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body?: unknown) {
    let message = `HTTP ${status}`
    if (body !== null && typeof body === 'object') {
      const b = body as Record<string, unknown>
      const violations = Array.isArray(b.violations)
        ? (b.violations as Array<{ message?: unknown }>)
        : undefined
      const firstViolation = violations?.find((v) => typeof v?.message === 'string')?.message as
        | string
        | undefined
      if (typeof b.message === 'string' && b.message.trim() !== '') message = b.message
      else if (firstViolation && firstViolation.trim() !== '') message = firstViolation
      else if (typeof b.detail === 'string' && b.detail.trim() !== '') message = b.detail
      else if (typeof b.title === 'string' && b.title.trim() !== '') message = b.title
      else if (typeof b.error === 'string' && b.error.trim() !== '') message = b.error
    } else if (typeof body === 'string' && body.trim() !== '') {
      message = body
    }

    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

export class HttpClient {
  private readonly baseUrl: string

  constructor(baseUrl = import.meta.env.VITE_API_URL || '/api/v1') {
    this.baseUrl = baseUrl
  }

  async request<TResponse>(path: string, options: RequestOptions = {}) {
    const { body, headers, method = 'GET', signal } = options
    const requestHeaders = new Headers(headers)

    if (shouldIncludeJsonContentType(body, requestHeaders)) {
      requestHeaders.set('Content-Type', 'application/json')
    }

    if (shouldAttachCsrfToken(method, path)) {
      const csrfToken =
        getCookie('assetdock_csrf') ??
        getCookie('X-CSRF-Token') ??
        getCookie('csrf_token') ??
        getCookie('XSRF-TOKEN')

      if (csrfToken) {
        requestHeaders.set('X-CSRF-Token', csrfToken)
      } else {
        throw new HttpError(403, { message: 'Forbidden', detail: 'Missing CSRF token in client cookies.' })
      }
    }

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        signal,
        credentials: 'include',
        headers: requestHeaders,
        body:
          body === undefined
            ? undefined
            : isFormData(body)
              ? body
              : JSON.stringify(body),
      })
    } catch (error) {
      if (error instanceof TypeError) {
        throw new HttpError(0, { message: 'Network Error', detail: 'A connection to the server could not be established.' })
      }
      throw error
    }

    if (!response.ok) {
      let body: unknown = undefined
      const contentType = response.headers.get('content-type')
      
      try {
        if (isJsonContentType(contentType)) {
          body = await response.json()
        } else {
          body = await response.text()
        }
      } catch {
        // Ignore parsing errors
      }

      throw new HttpError(response.status, body)
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    if (options.responseType === 'blob') {
      return (await response.blob()) as unknown as TResponse
    }

    const contentType = response.headers.get('content-type')
    if (isJsonContentType(contentType)) {
      return (await response.json()) as TResponse
    }

    return (await response.text()) as unknown as TResponse
  }
}

export const httpClient = new HttpClient()

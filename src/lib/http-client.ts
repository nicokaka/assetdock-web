type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
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

function shouldAttachCsrfToken(method: HttpMethod) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
}

export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

export class HttpClient {
  private readonly baseUrl: string

  constructor(baseUrl = import.meta.env.VITE_API_URL ?? '') {
    this.baseUrl = baseUrl
  }

  async request<TResponse>(path: string, options: RequestOptions = {}) {
    const { body, headers, method = 'GET', signal } = options
    const requestHeaders = new Headers(headers)

    if (shouldIncludeJsonContentType(body, requestHeaders)) {
      requestHeaders.set('Content-Type', 'application/json')
    }

    if (shouldAttachCsrfToken(method)) {
      const csrfToken = getCookie('X-CSRF-Token') ?? getCookie('csrf_token') ?? getCookie('XSRF-TOKEN')

      if (csrfToken) {
        requestHeaders.set('X-CSRF-Token', csrfToken)
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
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

    if (!response.ok) {
      throw new HttpError(response.status)
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    return (await response.json()) as TResponse
  }
}

export const httpClient = new HttpClient()

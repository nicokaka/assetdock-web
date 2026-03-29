type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

export class HttpClient {
  private readonly baseUrl: string

  constructor(baseUrl = import.meta.env.VITE_API_URL ?? '') {
    this.baseUrl = baseUrl
  }

  async request<TResponse>(path: string, options: RequestOptions = {}) {
    const { body, headers, method = 'GET', signal } = options

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    return (await response.json()) as TResponse
  }
}

export const httpClient = new HttpClient()

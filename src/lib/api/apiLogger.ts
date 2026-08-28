import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { loggerHelper } from '../logger/loggerHelper'

const SENSITIVE_KEYS = new Set(['password', 'access_token', 'accessToken', 'authorization', 'token'])

function resolveUrl(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL ?? ''
  const path = config.url ?? ''
  if (path.startsWith('http')) return path
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function sanitizeForLog(data: unknown, options?: { revealToken?: boolean }): unknown {
  if (data == null) return data

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForLog(item, options))
  }

  if (typeof data !== 'object') return data

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase()
    if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(lowerKey)) {
      if (options?.revealToken && (key === 'access_token' || key === 'accessToken')) {
        result[key] = value
      } else if (key === 'password' || lowerKey === 'password') {
        result[key] = '***'
      } else {
        result[key] = '[REDACTED]'
      }
      continue
    }
    result[key] = sanitizeForLog(value, options)
  }
  return result
}

export function logApiRequest(config: InternalAxiosRequestConfig) {
  const method = (config.method ?? 'GET').toUpperCase()
  const url = resolveUrl(config)

  loggerHelper.logCyan(`[API REQUEST] ${method} ${url}`, { name: 'API' })

  if (config.params) {
    loggerHelper.logFullObject(sanitizeForLog(config.params), { name: 'QueryParams' })
  }

  if (config.data !== undefined && config.data !== null && config.data !== '') {
    const body =
      typeof config.data === 'string'
        ? sanitizeForLog(tryParseJson(config.data))
        : sanitizeForLog(config.data)
    loggerHelper.logFullObject(body, { name: 'RequestBody' })
  }
}

export function logApiResponse(response: AxiosResponse) {
  const method = (response.config.method ?? 'GET').toUpperCase()
  const url = resolveUrl(response.config)
  const isLogin = url.includes('/auth/login')

  loggerHelper.success(`[API RESPONSE] ${method} ${url} -> ${response.status}`, { name: 'API' })
  loggerHelper.logFullObject(sanitizeForLog(response.data, { revealToken: isLogin }), {
    name: 'ResponseBody',
  })
}

export function logApiError(error: AxiosError) {
  const config = error.config
  const method = (config?.method ?? 'GET').toUpperCase()
  const url = config ? resolveUrl(config) : 'unknown'

  loggerHelper.error(`[API ERROR] ${method} ${url}`, {
    name: 'API',
    error: {
      code: error.code,
      status: error.response?.status,
      message: error.message,
      data: sanitizeForLog(error.response?.data),
    },
  })
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

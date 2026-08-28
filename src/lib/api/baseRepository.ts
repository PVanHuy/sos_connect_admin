import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './client'
import { ApiErrorKind, type AppError } from './errors'
import { sessionStore } from '../../features/auth/session/sessionStore'
import { APP_ROUTES } from '../../app/config/routes'
import { i18nStore } from '../../app/i18n/i18nStore'
import { logger } from '../logger/logger'

export interface MultipartBody {
  key: string
  file: File | null
}

export type OnUnauthorized = () => void

/**
 * Base repository (React/TS) tương đương IBaseRepository bên Flutter.
 * Hiện tại chủ yếu để chuẩn hoá cách gọi API/thêm headers.
 * TODO gắn logout/navigator thật theo contract backend sau.
 */
export class BaseRepository {
  // Flutter dùng 60s; trong project hiện tại apiClient đã timeout 15s.
  // Giữ hằng này chỉ để tương lai tuỳ biến per-request.
  readonly timeoutInMs = 60_000

  private buildAuthorizationHeaders(): Record<string, string> {
    const token = sessionStore.getState().accessToken
    const localization = i18nStore.getState().lang

    return {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      'X-localization': localization,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }

  private isAppError(value: unknown): value is AppError {
    if (typeof value !== 'object' || value === null) return false
    const v = value as Record<string, unknown>
    return typeof v.kind === 'string' && typeof v.message === 'string'
  }

  private maybeHandleUnauthorized(error: unknown, onUnauthorized?: OnUnauthorized) {
    if (!this.isAppError(error)) return
    if (error.kind !== ApiErrorKind.authentication) return

    // Giống Flutter: khi 401 => logout/redirect.
    // Không dùng hook ở repo, nên cho phép caller inject callback.
    if (onUnauthorized) {
      onUnauthorized()
      return
    }

    sessionStore.getState().clear()
    // Chọn redirect toàn trang để đảm bảo state được reset triệt để.
    // TODO: khi routing/auth flow hoàn chỉnh, có thể chuyển sang navigate.
    window.location.assign(APP_ROUTES.login)
  }

  async getData<T>(uri: string, headers?: Record<string, string>, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res = await apiClient.get<T>(uri, {
        headers: headers ?? this.buildAuthorizationHeaders(),
        ...config,
      })
      return res.data
    } catch (e) {
      this.maybeHandleUnauthorized(e, undefined)
      throw e
    }
  }

  async postJson<TResponse, TBody>(
    uri: string,
    body: TBody,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await apiClient.post<TResponse>(uri, body, {
        headers: headers ?? this.buildAuthorizationHeaders(),
        ...config,
      })
      return res.data
    } catch (e) {
      this.maybeHandleUnauthorized(e, undefined)
      throw e
    }
  }

  async putJson<TResponse, TBody>(
    uri: string,
    body: TBody,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await apiClient.put<TResponse>(uri, body, {
        headers: headers ?? this.buildAuthorizationHeaders(),
        ...config,
      })
      return res.data
    } catch (e) {
      this.maybeHandleUnauthorized(e, undefined)
      throw e
    }
  }

  async patchJson<TResponse, TBody>(
    uri: string,
    body: TBody,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await apiClient.patch<TResponse>(uri, body, {
        headers: headers ?? this.buildAuthorizationHeaders(),
        ...config,
      })
      return res.data
    } catch (e) {
      this.maybeHandleUnauthorized(e, undefined)
      throw e
    }
  }

  async deleteJson<TResponse, TBody = unknown>(
    uri: string,
    body?: TBody,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const res = await apiClient.delete<TResponse>(uri, {
        data: body,
        headers: headers ?? this.buildAuthorizationHeaders(),
        ...config,
      })
      return res.data
    } catch (e) {
      this.maybeHandleUnauthorized(e, undefined)
      throw e
    }
  }

  async postMultipartData<TResponse>(
    uri: string,
    fields: Record<string, string>,
    multipartBody: MultipartBody[],
    headers?: Record<string, string>,
  ): Promise<TResponse> {
    const formData = new FormData()

    for (const [k, v] of Object.entries(fields)) {
      formData.append(k, v)
    }

    for (const part of multipartBody) {
      if (!part.file) continue
      formData.append(part.key, part.file)
    }

    // Multipart không cần Content-Type thủ công: browser tự set boundary.
    const baseHeaders = this.buildAuthorizationHeaders()
    delete baseHeaders['Content-Type']

    const mergedHeaders = { ...baseHeaders, ...(headers ?? {}) }

    logger.debug('postMultipartData', { uri })
    const res = await apiClient.post<TResponse>(uri, formData, { headers: mergedHeaders })
    return res.data
  }
}


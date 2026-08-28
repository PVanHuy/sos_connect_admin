import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import { USER_ROLES, type UserRole } from '../../../utils/status'
import { loginResponseSchema } from '../schemas/login.schema'
import type { SessionUser } from '../session/sessionStore'

export interface LoginPayload {
  phone: string
  password: string
}

export interface LoginResult {
  user: SessionUser
  accessToken: string
}

function mapApiRole(roles: string): UserRole {
  const normalized = roles.trim().toUpperCase()
  if ((USER_ROLES as readonly string[]).includes(normalized)) {
    return normalized as UserRole
  }
  return 'CITIZEN'
}

function authError(message: string, kind: AppError['kind'] = ApiErrorKind.authentication): AppError {
  return { kind, message }
}

export async function loginApi(payload: LoginPayload): Promise<LoginResult> {
  loggerHelper.logCyan('[AUTH] Bắt đầu đăng nhập', { name: 'Auth' })
  loggerHelper.logFullObject(
    {
      endpoint: apiEndpoints.auth.login,
      phone: payload.phone,
      password: '***',
    },
    { name: 'LoginRequest' },
  )

  try {
    const { data, status } = await apiClient.post<unknown>(apiEndpoints.auth.login, payload)

    loggerHelper.success(`[AUTH] HTTP ${status}`, { name: 'Auth' })
    loggerHelper.logFullObject(data, { name: 'LoginRawResponse' })

    const parsed = loginResponseSchema.safeParse(data)
    if (!parsed.success) {
      loggerHelper.error('[AUTH] Parse response thất bại', {
        name: 'Auth',
        error: parsed.error.flatten(),
      })
      throw authError('Phản hồi đăng nhập không hợp lệ từ máy chủ.', ApiErrorKind.unknown)
    }

    const response = parsed.data
    if (!response.success) {
      loggerHelper.warn(`[AUTH] Login failed: ${response.message || 'unknown'}`, { name: 'Auth' })
      throw authError(response.message || 'Đăng nhập thất bại.')
    }

    if (!response.access_token) {
      loggerHelper.error('[AUTH] Thiếu access_token trong response', { name: 'Auth' })
      throw authError('Không nhận được access token từ máy chủ.', ApiErrorKind.unknown)
    }

    if (!response.user) {
      loggerHelper.error('[AUTH] Thiếu user trong response', { name: 'Auth' })
      throw authError('Không nhận được thông tin người dùng từ máy chủ.', ApiErrorKind.unknown)
    }

    loggerHelper.logMagenta(`[AUTH] access_token: ${response.access_token}`, { name: 'Auth' })
    loggerHelper.logFullObject(response.user, { name: 'LoginUser' })

    const role = mapApiRole(response.user.roles)
    loggerHelper.logBlue(`[AUTH] role mapped: ${response.user.roles} -> ${role}`, { name: 'Auth' })

    if (role !== 'ADMIN') {
      loggerHelper.warn('[AUTH] Tài khoản không phải ADMIN', { name: 'Auth' })
      throw authError(
        'Tài khoản này không có quyền truy cập trang admin.',
        ApiErrorKind.authorization,
      )
    }

    const result: LoginResult = {
      accessToken: response.access_token,
      user: {
        id: response.user.id,
        name: response.user.username,
        phone: response.user.phone,
        role,
      },
    }

    loggerHelper.success('[AUTH] Đăng nhập thành công, token đã sẵn sàng lưu session', {
      name: 'Auth',
    })
    loggerHelper.logFullObject(result, { name: 'LoginResult' })

    return result
  } catch (error) {
    loggerHelper.error('[AUTH] Login exception', { name: 'Auth', error })
    throw error
  }
}

export async function logoutApi(): Promise<void> {
  // TODO: POST apiEndpoints.auth.logout when backend contract is confirmed
  loggerHelper.logYellow('[AUTH] Logout (client-side only)', { name: 'Auth' })
}

import axios from 'axios'
import { appEnv } from '../../app/config/env'
import { sessionStore } from '../../features/auth/session/sessionStore'
import { logApiError, logApiRequest, logApiResponse } from './apiLogger'
import { ApiErrorKind, type AppError } from './errors'

export const apiClient = axios.create({
  baseURL: appEnv.VITE_API_URL,
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = sessionStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  logApiRequest(config)
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    logApiResponse(response)
    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      logApiError(error)
    }
    const appError = normalizeAxiosError(error)
    return Promise.reject(appError)
  },
)

function extractServerMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null || !('message' in data)) return undefined
  const message = (data as { message: unknown }).message
  return typeof message === 'string' && message.trim() ? message : undefined
}

function normalizeAxiosError(error: unknown): AppError {
  if (!axios.isAxiosError(error)) {
    return {
      kind: ApiErrorKind.unknown,
      message: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
    }
  }

  if (error.code === 'ECONNABORTED') {
    return {
      kind: ApiErrorKind.timeout,
      message: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
    }
  }

  if (!error.response) {
    return {
      kind: ApiErrorKind.network,
      message: 'Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.',
    }
  }

  const status = error.response.status
  const serverMessage = extractServerMessage(error.response.data)

  if (status === 401) {
    return {
      kind: ApiErrorKind.authentication,
      message: serverMessage ?? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      status,
    }
  }
  if (status === 403) {
    return {
      kind: ApiErrorKind.authorization,
      message: serverMessage ?? 'Bạn không có quyền thực hiện thao tác này.',
      status,
    }
  }
  if (status === 400) {
    return {
      kind: ApiErrorKind.validation,
      message: serverMessage ?? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
      status,
    }
  }
  if (status >= 500) {
    return {
      kind: ApiErrorKind.server,
      message: serverMessage ?? 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
      status,
    }
  }

  return {
    kind: ApiErrorKind.unknown,
    message: serverMessage ?? 'Không thể hoàn tất thao tác. Vui lòng thử lại.',
    status,
  }
}

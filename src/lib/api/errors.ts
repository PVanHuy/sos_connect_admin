export const ApiErrorKind = {
  validation: 'validation',
  authentication: 'authentication',
  authorization: 'authorization',
  network: 'network',
  timeout: 'timeout',
  server: 'server',
  unknown: 'unknown',
} as const

export type ApiErrorKind = (typeof ApiErrorKind)[keyof typeof ApiErrorKind]

export interface AppError {
  kind: ApiErrorKind
  message: string
  status?: number
}

export function toAppError(error: unknown): AppError {
  if (typeof error === 'object' && error !== null && 'kind' in error && 'message' in error) {
    const candidate = error as AppError
    return candidate
  }

  if (error instanceof Error) {
    return {
      kind: ApiErrorKind.unknown,
      message: error.message,
    }
  }

  return {
    kind: ApiErrorKind.unknown,
    message: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
  }
}

export function getUserFacingErrorMessage(error: AppError): string {
  switch (error.kind) {
    case ApiErrorKind.authentication:
      return error.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    case ApiErrorKind.authorization:
      return error.message || 'Bạn không có quyền thực hiện thao tác này.'
    case ApiErrorKind.network:
      return 'Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.'
    case ApiErrorKind.timeout:
      return 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.'
    case ApiErrorKind.validation:
      return error.message
    case ApiErrorKind.server:
      return 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
    default:
      return error.message || 'Không thể hoàn tất thao tác. Vui lòng thử lại.'
  }
}

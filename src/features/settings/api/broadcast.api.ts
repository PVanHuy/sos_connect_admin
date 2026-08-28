import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import {
  broadcastResponseSchema,
  type BroadcastFormValues,
} from '../schemas/broadcast.schema'

function broadcastApiError(
  message: string,
  kind: AppError['kind'] = ApiErrorKind.unknown,
): AppError {
  return { kind, message }
}

export interface BroadcastResult {
  message: string
  totalUsers?: number
  sent?: number
  failed?: number
}

export async function sendBroadcast(payload: BroadcastFormValues): Promise<BroadcastResult> {
  const body = {
    title: payload.title,
    content: payload.content,
    ...(payload.image_url?.trim() ? { image_url: payload.image_url.trim() } : {}),
  }

  loggerHelper.logCyan('[BROADCAST] Send', { name: 'BroadcastAPI', error: body })

  const { data } = await apiClient.post<unknown>(apiEndpoints.broadcast.send, body)
  const parsed = broadcastResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw broadcastApiError('Phản hồi gửi thông báo không hợp lệ.')
  }

  if (!parsed.data.success) {
    throw broadcastApiError('Không thể gửi thông báo.')
  }

  return {
    message: parsed.data.message ?? 'Gửi thông báo thành công.',
    totalUsers: parsed.data.total_users,
    sent: parsed.data.sent,
    failed: parsed.data.failed,
  }
}

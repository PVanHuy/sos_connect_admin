import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { mapApiPaginationToResult } from '../../../lib/api/pagination'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import type { AuditLog, PaginatedResult } from '../../../types/domain'
import { auditLogsListResponseSchema, type AuditLogApiDto } from '../schemas/auditLogs.schema'

export interface AuditLogsListParams {
  page: number
  pageSize: number
}

function auditLogsApiError(
  message: string,
  kind: AppError['kind'] = ApiErrorKind.unknown,
): AppError {
  return { kind, message }
}

function formatMetadata(metadata: unknown): string | null {
  if (metadata == null) return null
  if (typeof metadata === 'string') return metadata
  try {
    return JSON.stringify(metadata)
  } catch {
    return String(metadata)
  }
}

function mapAuditLogDto(dto: AuditLogApiDto): AuditLog {
  const metadata = formatMetadata(dto.metadata)
  return {
    id: dto.id,
    actor: dto.admin_id,
    action: dto.action,
    target: metadata ?? '—',
    createdAt: dto.timestamp,
    metadata,
  }
}

export async function fetchAuditLogs(
  params: AuditLogsListParams,
): Promise<PaginatedResult<AuditLog>> {
  loggerHelper.logCyan('[AUDIT] Fetch logs', {
    name: 'AuditAPI',
    error: { page: params.page, limit: params.pageSize },
  })

  const { data } = await apiClient.get<unknown>(apiEndpoints.auditLogs.list, {
    params: { page: params.page, limit: params.pageSize },
  })
  const parsed = auditLogsListResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw auditLogsApiError('Dữ liệu nhật ký không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw auditLogsApiError('Không thể tải nhật ký kiểm toán.')
  }

  const items = parsed.data.data.map(mapAuditLogDto)
  return mapApiPaginationToResult(items, parsed.data.pagination)
}

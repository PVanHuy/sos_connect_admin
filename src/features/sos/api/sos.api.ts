import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { mapApiPaginationToResult } from '../../../lib/api/pagination'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import type { PaginatedResult, SosRecord } from '../../../types/domain'
import type { SosStatus } from '../../../utils/status'
import {
  parseSosEventType,
  parseSosStatus,
  sosListResponseSchema,
  sosMutationResponseSchema,
  type SosApiDto,
} from '../schemas/sos.schema'

export interface SosListParams {
  status?: SosStatus | 'ALL'
  query?: string
  page: number
  pageSize: number
}

function sosApiError(message: string, kind: AppError['kind'] = ApiErrorKind.unknown): AppError {
  return { kind, message }
}

function mapSosDtoToRecord(dto: SosApiDto): SosRecord {
  return {
    id: dto.id,
    description: dto.description,
    eventTime: dto.created_at,
    lat: dto.lat,
    lon: dto.lon,
    locationName: dto.address_text,
    eventType: parseSosEventType(dto.type),
    status: parseSosStatus(dto.status),
    victimName: dto.phone,
    phone: dto.phone,
    province: dto.province ?? undefined,
    imageUrl: dto.image ?? undefined,
    teamId: dto.teamId ?? undefined,
    llmScore: dto.llm_score ?? undefined,
    rejectionReason: dto.rejection_reason ?? undefined,
  }
}

export async function fetchSosList(params: SosListParams): Promise<PaginatedResult<SosRecord>> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.status && params.status !== 'ALL') {
    query.status = params.status
  }
  if (params.query?.trim()) {
    query.keyword = params.query.trim()
  }

  loggerHelper.logCyan('[SOS] Fetch list', { name: 'SosAPI', error: query })

  const { data } = await apiClient.get<unknown>(apiEndpoints.sos.list, { params: query })
  const parsed = sosListResponseSchema.safeParse(data)

  if (!parsed.success) {
    loggerHelper.error('[SOS] Invalid response shape', {
      name: 'SosAPI',
      error: parsed.error.flatten(),
    })
    throw sosApiError('Dữ liệu SOS không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw sosApiError('Không thể tải danh sách SOS.')
  }

  const items = parsed.data.data.map(mapSosDtoToRecord)
  const result = mapApiPaginationToResult(items, parsed.data.pagination)

  loggerHelper.success(`[SOS] Loaded ${items.length} events (page ${result.page})`, {
    name: 'SosAPI',
  })

  return result
}

export async function fetchPendingSosRequests(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<SosRecord>> {
  loggerHelper.logCyan('[SOS] Fetch pending requests', { name: 'SosAPI', error: { page, limit: pageSize } })

  const { data } = await apiClient.get<unknown>(apiEndpoints.sos.pendingRequests, {
    params: { page, limit: pageSize },
  })
  const parsed = sosListResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw sosApiError('Dữ liệu SOS chờ duyệt không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw sosApiError('Không thể tải danh sách SOS chờ duyệt.')
  }

  const items = parsed.data.data.map(mapSosDtoToRecord)
  return mapApiPaginationToResult(items, parsed.data.pagination)
}

export async function fetchSosDetail(id: string): Promise<SosRecord | null> {
  for (let page = 1; page <= 5; page++) {
    const result = await fetchSosList({ status: 'ALL', page, pageSize: 50 })
    const found = result.items.find((item) => item.id === id)
    if (found) return found
    if (page >= (result.totalPages ?? 1)) break
  }
  return null
}

export async function approveSosEvent(eventId: string): Promise<SosRecord> {
  loggerHelper.logCyan(`[SOS] Approve ${eventId}`, { name: 'SosAPI' })
  const { data } = await apiClient.post<unknown>(apiEndpoints.sos.approve(eventId))
  const parsed = sosMutationResponseSchema.safeParse(data)
  if (!parsed.success || !parsed.data.data) {
    throw sosApiError('Phản hồi duyệt SOS không hợp lệ.')
  }
  return mapSosDtoToRecord(parsed.data.data)
}

export async function rejectSosEvent(eventId: string, message: string): Promise<void> {
  loggerHelper.logYellow(`[SOS] Reject ${eventId}`, { name: 'SosAPI' })
  await apiClient.post(apiEndpoints.sos.reject(eventId), { message })
}

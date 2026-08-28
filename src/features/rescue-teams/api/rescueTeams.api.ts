import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { mapApiPaginationToResult } from '../../../lib/api/pagination'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import type { PaginatedResult, RescueTeam } from '../../../types/domain'
import { toApiTeamStatus, type TeamStatus } from '../../../utils/status'
import {
  parseTeamStatus,
  teamMutationResponseSchema,
  teamsListResponseSchema,
  type TeamApiDto,
} from '../schemas/teams.schema'

export interface TeamListParams {
  status?: TeamStatus | 'ALL'
  query?: string
  page: number
  pageSize: number
}

function teamsApiError(message: string, kind: AppError['kind'] = ApiErrorKind.unknown): AppError {
  return { kind, message }
}

function mapTeamDtoToRescueTeam(dto: TeamApiDto): RescueTeam {
  return {
    id: dto.id,
    name: dto.name,
    province: dto.province,
    district: dto.district,
    commune: dto.commune,
    sizeMember: dto.size_member,
    organizational: dto.organizational,
    leader: dto.leader,
    phone: dto.phone,
    email: dto.email,
    position: dto.position,
    documentUrl: dto.document_url,
    leaderId: dto.leader_id,
    status: parseTeamStatus(dto.team_status),
    createdAt: dto.created_at,
    lat: dto.team_lat,
    lon: dto.team_lon,
    rejectionReason: dto.rejection_reason,
    deleteReason: dto.delete_reason,
  }
}

function parseTeamMutationResponse(data: unknown): RescueTeam {
  const parsed = teamMutationResponseSchema.safeParse(data)
  if (!parsed.success || !parsed.data.data) {
    throw teamsApiError('Phản hồi cập nhật đội cứu hộ không hợp lệ.')
  }
  return mapTeamDtoToRescueTeam(parsed.data.data)
}

export async function fetchRescueTeams(
  params: TeamListParams,
): Promise<PaginatedResult<RescueTeam>> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.status && params.status !== 'ALL') {
    query.status = toApiTeamStatus(params.status)
  }
  if (params.query?.trim()) {
    query.keyword = params.query.trim()
  }

  loggerHelper.logCyan('[TEAMS] Fetch list', { name: 'TeamsAPI', error: query })

  const { data } = await apiClient.get<unknown>(apiEndpoints.teams.list, { params: query })
  const parsed = teamsListResponseSchema.safeParse(data)

  if (!parsed.success) {
    loggerHelper.error('[TEAMS] Invalid response shape', {
      name: 'TeamsAPI',
      error: parsed.error.flatten(),
    })
    throw teamsApiError('Dữ liệu đội cứu hộ không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw teamsApiError('Không thể tải danh sách đội cứu hộ.')
  }

  const items = parsed.data.data.map(mapTeamDtoToRescueTeam)
  const result = mapApiPaginationToResult(items, parsed.data.pagination)

  loggerHelper.success(`[TEAMS] Loaded ${items.length} teams (page ${result.page})`, {
    name: 'TeamsAPI',
  })

  return result
}

/** Đội chờ duyệt — luôn gửi status=PENDING cho API. */
export async function fetchPendingRescueTeams(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<RescueTeam>> {
  const query = {
    page,
    limit: pageSize,
    status: 'PENDING',
  }

  loggerHelper.logCyan('[TEAMS] Fetch pending approvals', { name: 'TeamsAPI', error: query })

  const { data } = await apiClient.get<unknown>(apiEndpoints.teams.list, { params: query })
  const parsed = teamsListResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw teamsApiError('Dữ liệu đội chờ duyệt không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw teamsApiError('Không thể tải danh sách đội chờ duyệt.')
  }

  const items = parsed.data.data
    .map(mapTeamDtoToRescueTeam)
    .filter((team) => team.status === 'pending')

  return mapApiPaginationToResult(items, parsed.data.pagination)
}

export async function updateRescueTeamStatus(
  id: string,
  status: TeamStatus,
): Promise<RescueTeam> {
  const apiStatus = toApiTeamStatus(status)
  loggerHelper.logCyan(`[TEAMS] Update status ${id} -> ${apiStatus}`, { name: 'TeamsAPI' })

  const { data } = await apiClient.patch<unknown>(apiEndpoints.teams.updateStatus(id), {
    status: apiStatus,
  })

  const team = parseTeamMutationResponse(data)
  loggerHelper.success(`[TEAMS] Updated status for ${team.name}`, { name: 'TeamsAPI' })
  return team
}

export async function deleteRescueTeam(id: string, message: string): Promise<void> {
  loggerHelper.logYellow(`[TEAMS] Delete ${id}`, { name: 'TeamsAPI' })
  await apiClient.delete(apiEndpoints.teams.delete(id), {
    data: { message },
  })
  loggerHelper.success(`[TEAMS] Deleted ${id}`, { name: 'TeamsAPI' })
}

export async function approveRescueTeam(id: string): Promise<RescueTeam> {
  loggerHelper.logCyan(`[TEAMS] Approve ${id}`, { name: 'TeamsAPI' })
  const { data } = await apiClient.post<unknown>(apiEndpoints.teams.approve(id))
  return parseTeamMutationResponse(data)
}

export async function rejectRescueTeam(id: string, message: string): Promise<void> {
  loggerHelper.logYellow(`[TEAMS] Reject ${id}`, { name: 'TeamsAPI' })
  await apiClient.post(apiEndpoints.teams.reject(id), { message })
}

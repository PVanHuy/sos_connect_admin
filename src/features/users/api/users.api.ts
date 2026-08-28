import { apiClient } from '../../../lib/api/client'
import { apiEndpoints } from '../../../lib/api/endpoints'
import { ApiErrorKind, type AppError } from '../../../lib/api/errors'
import { mapApiPaginationToResult } from '../../../lib/api/pagination'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import type { AdminUser, PaginatedResult } from '../../../types/domain'
import { type UserApiDto, usersListResponseSchema } from '../schemas/users.schema'

export interface UserListParams {
  role?: string
  query?: string
  page: number
  pageSize: number
}

function mapUserDtoToAdminUser(dto: UserApiDto): AdminUser {
  return {
    id: dto.id,
    username: dto.username,
    name: dto.username,
    email: dto.email ?? '—',
    phone: dto.phone ?? '—',
    address: dto.address ?? undefined,
    province: dto.province ?? undefined,
    role: dto.roles,
    teamId: dto.team_id == null ? undefined : String(dto.team_id),
    avatar: dto.avatar,
    cccd: dto.cccd,
  }
}

function usersApiError(message: string): AppError {
  return { kind: ApiErrorKind.unknown, message }
}

export async function fetchUsers(params: UserListParams): Promise<PaginatedResult<AdminUser>> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.role?.trim()) {
    query.role = params.role.trim()
  }
  if (params.query?.trim()) {
    query.keyword = params.query.trim()
  }

  loggerHelper.logCyan('[USERS] Fetch list', { name: 'UsersAPI', error: query })

  const { data } = await apiClient.get<unknown>(apiEndpoints.users.list, { params: query })
  const parsed = usersListResponseSchema.safeParse(data)

  if (!parsed.success) {
    loggerHelper.error('[USERS] Invalid response shape', {
      name: 'UsersAPI',
      error: parsed.error.flatten(),
    })
    throw usersApiError('Dữ liệu người dùng không hợp lệ từ máy chủ.')
  }

  if (!parsed.data.success) {
    throw usersApiError('Không thể tải danh sách người dùng.')
  }

  const items = parsed.data.users.map(mapUserDtoToAdminUser)
  const result = mapApiPaginationToResult(items, parsed.data.pagination)

  loggerHelper.success(`[USERS] Loaded ${items.length} users (page ${result.page})`, {
    name: 'UsersAPI',
  })

  return result
}

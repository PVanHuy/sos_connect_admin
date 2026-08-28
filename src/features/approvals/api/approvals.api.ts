import type { ApprovalRequest, PaginatedResult } from '../../../types/domain'
import type { ApprovalKind } from '../../../utils/status'
import { approveRescueTeam, fetchPendingRescueTeams, rejectRescueTeam } from '../../rescue-teams/api/rescueTeams.api'
import {
  approveSosEvent,
  fetchPendingSosRequests,
  rejectSosEvent,
} from '../../sos/api/sos.api'

export type ApprovalsTab = 'ALL' | ApprovalKind

export interface ApprovalsListParams {
  kind: ApprovalsTab
  page: number
  pageSize: number
}

function mapTeamToApproval(team: {
  id: string
  name: string
  leader: string
  phone: string
  commune: string
  district?: string | null
  province: string
  createdAt: string
  email?: string | null
  organizational?: string | null
  sizeMember: string
  documentUrl?: string | null
  lat?: number | null
  lon?: number | null
  status: 'pending' | 'approved' | 'rejected'
}): ApprovalRequest {
  const location = [team.commune, team.district, team.province].filter(Boolean).join(', ')
  const documentUrl = team.documentUrl ?? undefined
  return {
    id: `team-${team.id}`,
    kind: 'RESCUE_TEAM',
    targetId: team.id,
    title: `Đăng ký đội: ${team.name}`,
    teamName: team.name,
    requester: team.leader,
    location,
    phone: team.phone,
    email: team.email ?? undefined,
    organizational: team.organizational ?? undefined,
    sizeMember: team.sizeMember,
    documentUrl,
    imageUrl: isImageAttachmentUrl(documentUrl) ? documentUrl : undefined,
    province: team.province,
    lat: team.lat ?? undefined,
    lon: team.lon ?? undefined,
    createdAt: team.createdAt,
    status: 'PENDING',
  }
}

function mapSosToApproval(sos: {
  id: string
  description: string
  eventType: ApprovalRequest['eventType']
  phone?: string
  locationName: string
  eventTime: string
  imageUrl?: string
  province?: string
  lat: number
  lon: number
  llmScore?: number
}): ApprovalRequest {
  return {
    id: `sos-${sos.id}`,
    kind: 'SOS',
    targetId: sos.id,
    title: `SOS chờ duyệt: ${sos.description}`,
    requester: sos.phone ?? '—',
    location: sos.locationName,
    phone: sos.phone,
    description: sos.description,
    eventType: sos.eventType,
    imageUrl: sos.imageUrl,
    province: sos.province,
    lat: sos.lat,
    lon: sos.lon,
    llmScore: sos.llmScore,
    createdAt: sos.eventTime,
    status: 'PENDING',
  }
}

function isImageAttachmentUrl(url?: string): boolean {
  if (!url) return false
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
}

async function fetchPendingTeamsAsApprovals(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<ApprovalRequest>> {
  const result = await fetchPendingRescueTeams(page, pageSize)
  return {
    ...result,
    items: result.items.map(mapTeamToApproval),
  }
}

async function fetchPendingSosAsApprovals(
  page: number,
  pageSize: number,
): Promise<PaginatedResult<ApprovalRequest>> {
  const result = await fetchPendingSosRequests(page, pageSize)
  return {
    ...result,
    items: result.items.map(mapSosToApproval),
  }
}

export async function fetchApprovals(
  params: ApprovalsListParams,
): Promise<PaginatedResult<ApprovalRequest>> {
  if (params.kind === 'RESCUE_TEAM') {
    return fetchPendingTeamsAsApprovals(params.page, params.pageSize)
  }
  if (params.kind === 'SOS') {
    return fetchPendingSosAsApprovals(params.page, params.pageSize)
  }

  const [teams, sos] = await Promise.all([
    fetchPendingTeamsAsApprovals(params.page, params.pageSize),
    fetchPendingSosAsApprovals(params.page, params.pageSize),
  ])

  const items = [...teams.items, ...sos.items].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    total: teams.total + sos.total,
    totalPages: Math.max(teams.totalPages ?? 1, sos.totalPages ?? 1),
  }
}

export async function approveApproval(item: ApprovalRequest): Promise<void> {
  if (item.kind === 'SOS') {
    await approveSosEvent(item.targetId)
    return
  }
  await approveRescueTeam(item.targetId)
}

export async function rejectApproval(item: ApprovalRequest, message: string): Promise<void> {
  if (item.kind === 'SOS') {
    await rejectSosEvent(item.targetId, message)
    return
  }
  await rejectRescueTeam(item.targetId, message)
}

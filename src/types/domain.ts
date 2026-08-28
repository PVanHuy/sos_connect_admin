import type {
  ApprovalKind,
  ApprovalStatus,
  SosEventType,
  SosStatus,
  TeamStatus,
} from '../utils/status'

export interface AdminUser {
  id: string
  username: string
  name: string
  email: string
  phone: string
  address?: string
  province?: string
  role: string
  teamId?: string
  avatar?: string | null
  cccd?: string | null
}

export interface SosRecord {
  id: string
  description: string
  eventTime: string
  lat: number
  lon: number
  locationName: string
  eventType: SosEventType
  status: SosStatus
  victimName: string
  phone?: string
  rescuerName?: string
  province?: string
  imageUrl?: string
  teamId?: string
  llmScore?: number
  rejectionReason?: string
}

export interface RescueTeam {
  id: string
  name: string
  province: string
  district?: string | null
  commune: string
  sizeMember: string
  organizational?: string | null
  leader: string
  phone: string
  email?: string | null
  position?: string | null
  documentUrl?: string | null
  leaderId?: string | null
  status: TeamStatus
  createdAt: string
  lat?: number | null
  lon?: number | null
  rejectionReason?: string | null
  deleteReason?: string | null
}

export interface ApprovalRequest {
  id: string
  kind: ApprovalKind
  targetId: string
  title: string
  requester: string
  location: string
  phone?: string
  description?: string
  eventType?: SosEventType
  createdAt: string
  status: ApprovalStatus
  imageUrl?: string
  documentUrl?: string
  province?: string
  lat?: number
  lon?: number
  llmScore?: number
  email?: string
  organizational?: string
  sizeMember?: string
  teamName?: string
}

export interface PriorityWeight {
  id: string
  name: string
  key: string
  value: number
  description: string
}

export interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalUsers: number
  totalTeams: number
  pendingApprovals: number
  completedToday: number
}

export type DashboardTrendPeriod = 'day' | 'month' | 'year'

export interface DashboardTrendPoint {
  label: string
  events: number
  users: number
  teams: number
}

export interface DashboardAnalytics {
  stats: DashboardStats
  trends: Record<DashboardTrendPeriod, DashboardTrendPoint[]>
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages?: number
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
  metadata?: string | null
}

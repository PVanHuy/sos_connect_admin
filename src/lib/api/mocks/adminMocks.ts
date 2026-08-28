import type { DashboardAnalytics, DashboardStats, PriorityWeight } from '../../../types/domain'

export const mockStats: DashboardStats = {
  totalEvents: 128,
  activeEvents: 17,
  totalUsers: 842,
  totalTeams: 36,
  pendingApprovals: 4,
  completedToday: 12,
}

export const mockDashboardAnalytics: DashboardAnalytics = {
  stats: mockStats,
  trends: {
    day: [
      { label: 'T2', events: 12, users: 18, teams: 2 },
      { label: 'T3', events: 16, users: 22, teams: 1 },
      { label: 'T4', events: 11, users: 15, teams: 1 },
      { label: 'T5', events: 20, users: 27, teams: 3 },
      { label: 'T6', events: 18, users: 24, teams: 2 },
      { label: 'T7', events: 25, users: 31, teams: 4 },
      { label: 'CN', events: 14, users: 19, teams: 1 },
    ],
    month: [
      { label: 'T1', events: 70, users: 45, teams: 4 },
      { label: 'T2', events: 62, users: 52, teams: 3 },
      { label: 'T3', events: 81, users: 61, teams: 4 },
      { label: 'T4', events: 78, users: 58, teams: 2 },
      { label: 'T5', events: 93, users: 74, teams: 5 },
      { label: 'T6', events: 88, users: 79, teams: 3 },
      { label: 'T7', events: 104, users: 85, teams: 6 },
      { label: 'T8', events: 128, users: 96, teams: 9 },
    ],
    year: [
      { label: '2022', events: 580, users: 220, teams: 18 },
      { label: '2023', events: 760, users: 410, teams: 24 },
      { label: '2024', events: 910, users: 560, teams: 28 },
      { label: '2025', events: 1080, users: 720, teams: 33 },
      { label: '2026', events: 1280, users: 842, teams: 36 },
    ],
  },
}

export const mockWeights: PriorityWeight[] = [
  {
    id: '1',
    name: 'Mức độ nghiêm trọng',
    key: 'severity',
    value: 40,
    description: 'Trọng số theo mức nguy hiểm của sự kiện SOS',
  },
  {
    id: '2',
    name: 'Khoảng cách',
    key: 'distance',
    value: 25,
    description: 'Ưu tiên đội gần vị trí sự kiện hơn',
  },
  {
    id: '3',
    name: 'Năng lực đội',
    key: 'team_capacity',
    value: 20,
    description: 'Quy mô và trang thiết bị của đội cứu hộ',
  },
  {
    id: '4',
    name: 'Thời gian phản hồi',
    key: 'response_time',
    value: 15,
    description: 'Lịch sử thời gian phản hồi trung bình',
  },
]

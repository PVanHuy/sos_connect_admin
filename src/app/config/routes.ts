export const APP_ROUTES = {
  login: '/login',
  app: '/app',
  dashboard: '/app/dashboard',
  sos: '/app/sos',
  sosDetail: '/app/sos/:id',
  sosMap: '/app/sos-map',
  rescueTeams: '/app/rescue-teams',
  users: '/app/users',
  approvals: '/app/approvals',
  priorityWeights: '/app/priority-weights',
  auditLogs: '/app/audit-logs',
  settings: '/settings',
} as const

export function sosDetailPath(id: string): string {
  return `/app/sos/${id}`
}

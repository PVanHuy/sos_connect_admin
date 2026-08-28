export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  dashboard: {
    stats: '/admin/dashboard/stats',
  },
  sos: {
    list: '/admin/all-events',
    pendingRequests: '/admin/event/requests',
    approve: (id: string) => `/admin/approve/events/${id}`,
    reject: (id: string) => `/admin/sos/${id}/reject`,
  },
  users: {
    list: '/admin/users',
  },
  teams: {
    list: '/admin/teams',
    update: (id: string) => `/admin/update/teams/${id}`,
    updateStatus: (id: string) => `/admin/update/teams/status/${id}`,
    delete: (id: string) => `/admin/team/${id}`,
    approve: (id: string) => `/admin/approve/teams/${id}`,
    reject: (id: string) => `/admin/team/${id}/reject`,
  },
  broadcast: {
    send: '/admin/broadcast',
  },
  weights: {
    list: '/admin/priority-weights',
    save: '/admin/priority-weights',
  },
  auditLogs: {
    list: '/admin/logs',
  },
} as const

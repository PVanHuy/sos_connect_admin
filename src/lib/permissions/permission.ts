import type { UserRole } from '../../utils/status'

export const PERMISSIONS = [
  'dashboard.read',
  'sos.read',
  'sos.update',
  'users.manage',
  'teams.manage',
  'approvals.manage',
  'weights.manage',
  'audit.read',
] as const

export type Permission = (typeof PERMISSIONS)[number]

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  ADMIN: PERMISSIONS,
  TEAM_LEADER: ['dashboard.read', 'sos.read', 'sos.update', 'teams.manage'],
  RESCUER: ['dashboard.read', 'sos.read'],
  CITIZEN: [],
}

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role].includes(permission)
}

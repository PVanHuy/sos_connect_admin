import { userRoleLabel, type UserRole } from '../../../utils/status'

/** Vai trò dùng cho filter API — khớp giá trị backend, không trùng label. */
export const USER_FILTER_ROLES = [
  'ADMIN',
  'USER',
  'GUEST',
  'LEADER',
  'VOLUNTEER',
  'CITIZEN',
  'RESCUER',
] as const satisfies readonly UserRole[]

export type UserFilterRole = (typeof USER_FILTER_ROLES)[number]

export function getUserFilterOptions() {
  return USER_FILTER_ROLES.map((role) => ({
    value: role,
    label: userRoleLabel[role],
  }))
}

export function parseUserFilterRole(value: string | null): UserFilterRole | 'ALL' {
  if (!value || value === 'ALL') return 'ALL'
  return (USER_FILTER_ROLES as readonly string[]).includes(value) ? (value as UserFilterRole) : 'ALL'
}

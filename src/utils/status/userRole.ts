import { appColors } from '../../app/theme/colors'
import type { Language } from '../../app/i18n/i18nStore'

export const USER_ROLES = [
  'CITIZEN',
  'RESCUER',
  'TEAM_LEADER',
  'LEADER',
  'VOLUNTEER',
  'ADMIN',
  'USER',
  'GUEST',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export const userRoleLabel: Record<UserRole, string> = {
  CITIZEN: 'Công dân',
  RESCUER: 'Cứu hộ',
  TEAM_LEADER: 'Đội trưởng',
  LEADER: 'Đội trưởng',
  VOLUNTEER: 'Tình nguyện viên',
  ADMIN: 'Admin',
  USER: 'Người dùng',
  GUEST: 'Khách',
}

const userRoleLabelByLang: Record<Language, Record<UserRole, string>> = {
  vi: userRoleLabel,
  en: {
    CITIZEN: 'Citizen',
    RESCUER: 'Rescuer',
    TEAM_LEADER: 'Team Leader',
    LEADER: 'Leader',
    VOLUNTEER: 'Volunteer',
    ADMIN: 'Admin',
    USER: 'User',
    GUEST: 'Guest',
  },
}

/** Màu tag theo vai trò — dùng palette app, tránh xám nhạt. */
export const userRoleColor: Record<UserRole, string> = {
  ADMIN: appColors.primaryColor,
  USER: appColors.blue8FFColor,
  GUEST: appColors.yellow22Color,
  TEAM_LEADER: appColors.mintyWaveColor,
  LEADER: appColors.mintyWaveColor,
  VOLUNTEER: appColors.green47Color,
  RESCUER: appColors.red26Color,
  CITIZEN: appColors.blueAFFColor,
}

const unknownRoleColor = appColors.purpleFFColor

export function normalizeUserRole(role: string): UserRole | null {
  const normalized = role.trim().toUpperCase()
  if (isUserRole(normalized)) return normalized
  return null
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}

export function getUserRoleLabelSafe(lang: Language, role: string): string {
  const normalized = normalizeUserRole(role)
  if (normalized) {
    return getUserRoleLabel(lang, normalized)
  }
  return role
}

export function getUserRoleColorSafe(role: string): string {
  const normalized = normalizeUserRole(role)
  if (normalized) {
    return userRoleColor[normalized]
  }
  return unknownRoleColor
}

export function getUserRoleLabel(lang: Language, role: UserRole): string {
  return userRoleLabelByLang[lang][role]
}

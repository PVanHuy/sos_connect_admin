import { appColors } from '../../app/theme/colors'
import type { Language } from '../../app/i18n/i18nStore'

export const TEAM_STATUSES = ['pending', 'approved', 'rejected'] as const

export type TeamStatus = (typeof TEAM_STATUSES)[number]

export const teamStatusLabel: Record<TeamStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

const teamStatusLabelByLang: Record<Language, Record<TeamStatus, string>> = {
  vi: teamStatusLabel,
  en: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },
}

export function isTeamStatus(value: string): value is TeamStatus {
  return (TEAM_STATUSES as readonly string[]).includes(value)
}

export function normalizeTeamStatus(value: string): TeamStatus | null {
  const normalized = value.trim().toLowerCase()
  return isTeamStatus(normalized) ? normalized : null
}

/** Backend PATCH/filter dùng UPPERCASE: PENDING | APPROVED | REJECTED */
export function toApiTeamStatus(status: TeamStatus): string {
  return status.toUpperCase()
}

export function getTeamStatusLabel(lang: Language, status: TeamStatus): string {
  return teamStatusLabelByLang[lang][status]
}

export const teamStatusColor: Record<TeamStatus, string> = {
  pending: appColors.yellow22Color,
  approved: appColors.green47Color,
  rejected: appColors.red26Color,
}

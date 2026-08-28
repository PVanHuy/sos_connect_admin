import { appColors } from '../../app/theme/colors'
import type { Language } from '../../app/i18n/i18nStore'

export const APPROVAL_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number]

export const approvalStatusLabel: Record<ApprovalStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
}

const approvalStatusLabelByLang: Record<Language, Record<ApprovalStatus, string>> = {
  vi: approvalStatusLabel,
  en: {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  },
}

export function getApprovalStatusLabel(lang: Language, status: ApprovalStatus): string {
  return approvalStatusLabelByLang[lang][status]
}

export const approvalStatusColor: Record<ApprovalStatus, string> = {
  PENDING: appColors.yellow22Color,
  APPROVED: appColors.green47Color,
  REJECTED: appColors.red26Color,
}

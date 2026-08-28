import type { Language } from '../../app/i18n/i18nStore'

/** Admin only approves: team registration + user SOS submissions. */
export const APPROVAL_KINDS = ['RESCUE_TEAM', 'SOS'] as const

export type ApprovalKind = (typeof APPROVAL_KINDS)[number]

export const approvalKindLabel: Record<ApprovalKind, string> = {
  RESCUE_TEAM: 'Đăng ký đội cứu hộ',
  SOS: 'Yêu cầu SOS',
}

const approvalKindLabelByLang: Record<Language, Record<ApprovalKind, string>> = {
  vi: approvalKindLabel,
  en: {
    RESCUE_TEAM: 'Rescue team registration',
    SOS: 'SOS request',
  },
}

export function getApprovalKindLabel(lang: Language, kind: ApprovalKind): string {
  return approvalKindLabelByLang[lang][kind]
}

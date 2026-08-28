import { Tag } from 'antd'
import { i18nStore } from '../../app/i18n/i18nStore'
import {
  approvalStatusColor,
  getApprovalStatusLabel,
  getSosEventTypeLabelSafe,
  getSosStatusColorSafe,
  getSosStatusLabelSafe,
  getTeamStatusLabel,
  getUserRoleLabelSafe,
  getUserRoleColorSafe,
  teamStatusColor,
  type ApprovalStatus,
  type SosEventType,
  type SosStatus,
  type TeamStatus,
} from '../../utils/status'

export function SosStatusTag({ status }: { status: SosStatus | string }) {
  const lang = i18nStore((s) => s.lang)
  const normalized = typeof status === 'string' ? status : status
  return (
    <Tag color={getSosStatusColorSafe(normalized)}>
      {getSosStatusLabelSafe(lang, normalized)}
    </Tag>
  )
}

export function TeamStatusTag({ status }: { status: TeamStatus }) {
  const lang = i18nStore((s) => s.lang)
  return <Tag color={teamStatusColor[status]}>{getTeamStatusLabel(lang, status)}</Tag>
}

export function RoleTag({ role }: { role: string }) {
  const lang = i18nStore((s) => s.lang)
  return (
    <Tag color={getUserRoleColorSafe(role)}>{getUserRoleLabelSafe(lang, role)}</Tag>
  )
}

export function ApprovalStatusTag({ status }: { status: ApprovalStatus }) {
  const lang = i18nStore((s) => s.lang)
  return <Tag color={approvalStatusColor[status]}>{getApprovalStatusLabel(lang, status)}</Tag>
}

export function SosTypeText({ type }: { type: SosEventType | string }) {
  const lang = i18nStore((s) => s.lang)
  return <span>{getSosEventTypeLabelSafe(lang, type)}</span>
}

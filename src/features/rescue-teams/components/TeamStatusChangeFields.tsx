import { Select } from 'antd'
import { TEAM_STATUSES, getTeamStatusLabel, type TeamStatus } from '../../../utils/status'
import type { Language } from '../../../app/i18n/i18nStore'

interface TeamStatusChangeFieldsProps {
  value: TeamStatus
  lang: Language
  onChange: (status: TeamStatus) => void
}

export function TeamStatusChangeFields({ value, lang, onChange }: TeamStatusChangeFieldsProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>Chọn trạng thái mới cho đội này.</div>
      <Select
        defaultValue={value}
        style={{ width: '100%' }}
        options={TEAM_STATUSES.map((status) => ({
          value: status,
          label: getTeamStatusLabel(lang, status),
        }))}
        onChange={onChange}
      />
    </div>
  )
}

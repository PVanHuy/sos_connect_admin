import { Input } from 'antd'

interface RejectReasonFieldsProps {
  label?: string
  placeholder?: string
  onChange: (message: string) => void
}

export function RejectReasonFields({
  label = 'Nhập lý do từ chối.',
  placeholder = 'Ví dụ: Thông tin không hợp lệ',
  onChange,
}: RejectReasonFieldsProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>{label}</div>
      <Input.TextArea
        rows={3}
        placeholder={placeholder}
        maxLength={500}
        showCount
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

import { Input } from 'antd'

interface TeamDeleteFieldsProps {
  onChange: (message: string) => void
}

export function TeamDeleteFields({ onChange }: TeamDeleteFieldsProps) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>
        Nhập lý do xóa đội cứu hộ. Lý do này sẽ được gửi thông báo cho đội trưởng.
      </div>
      <Input.TextArea
        rows={3}
        placeholder="Ví dụ: Đội đăng ký thông tin sai/giả mạo"
        maxLength={500}
        showCount
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

import { Card, Descriptions } from 'antd'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../../app/config/routes'
import { PageHeader } from '../../../components/shared/PageHeader'
import { QueryState } from '../../../components/shared/QueryState'
import { CustomButton } from '../../../components/ui/CustomButton'
import { SosStatusTag, SosTypeText } from '../../../components/ui/StatusTag'
import { formatDateTime, formatPhone } from '../../../utils/format'
import { useSosDetailsPage } from '../hooks/useSosDetailsPage'

export function SosDetailsPage() {
  const navigate = useNavigate()
  const { record, isLoading, isError, errorMessage } = useSosDetailsPage()

  return (
    <>
      <PageHeader
        title={record?.id ?? 'Chi tiết SOS'}
        description="Thông tin sự kiện cứu hộ từ API."
        extra={
          <CustomButton
            isFullWidth={false}
            variant="ghost"
            textColor="#1F2937"
            buttonText="Quay lại danh sách"
            onPressed={() => navigate(APP_ROUTES.sos)}
          />
        }
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        isEmpty={!record}
        emptyDescription="Không tìm thấy sự kiện SOS."
      >
        {record ? (
          <Card>
            <Descriptions column={{ xs: 1, md: 2 }} bordered>
              <Descriptions.Item label="Mã">{record.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <SosStatusTag status={record.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Loại">
                <SosTypeText type={record.eventType} />
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">{formatDateTime(record.eventTime)}</Descriptions.Item>
              <Descriptions.Item label="Người gửi">{record.victimName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{formatPhone(record.phone)}</Descriptions.Item>
              <Descriptions.Item label="Địa điểm" span={2}>
                {record.locationName}
              </Descriptions.Item>
              <Descriptions.Item label="Tọa độ">
                {record.lat}, {record.lon}
              </Descriptions.Item>
              <Descriptions.Item label="Đội cứu hộ">{record.rescuerName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {record.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : null}
      </QueryState>
    </>
  )
}

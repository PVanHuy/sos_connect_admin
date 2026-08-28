import { Card, Descriptions, Image, Space, Tag, Typography } from 'antd'
import { appColors } from '../../../app/theme/colors'
import { i18nStore } from '../../../app/i18n/i18nStore'
import { CustomButton } from '../../../components/ui/CustomButton'
import { ApprovalStatusTag, SosTypeText } from '../../../components/ui/StatusTag'
import type { ApprovalRequest } from '../../../types/domain'
import { formatDateTime, formatPhone } from '../../../utils/format'
import { getApprovalKindLabel } from '../../../utils/status'

interface ApprovalRequestCardProps {
  item: ApprovalRequest
  isDeciding: boolean
  onApprove: (item: ApprovalRequest) => void
  onReject: (item: ApprovalRequest) => void
}

function ApprovalKindTag({ kind }: { kind: ApprovalRequest['kind'] }) {
  const lang = i18nStore((s) => s.lang)
  const color = kind === 'RESCUE_TEAM' ? appColors.mintyWaveColor : appColors.appColor
  return <Tag color={color}>{getApprovalKindLabel(lang, kind)}</Tag>
}

function AttachmentPreview({ item }: { item: ApprovalRequest }) {
  if (item.imageUrl) {
    return (
      <Image
        src={item.imageUrl}
        alt={item.kind === 'SOS' ? 'Ảnh SOS' : 'Ảnh giấy tờ đội'}
        style={{
          width: '100%',
          maxHeight: 220,
          objectFit: 'cover',
          borderRadius: 12,
          border: `1px solid ${appColors.grayEBColor}`,
        }}
      />
    )
  }

  if (item.documentUrl) {
    return (
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: `1px dashed ${appColors.grayEBColor}`,
          background: appColors.grayF5Color,
        }}
      >
        <Typography.Text>Giấy tờ đính kèm:</Typography.Text>
        <div>
          <Typography.Link href={item.documentUrl} target="_blank" rel="noreferrer">
            Xem tài liệu
          </Typography.Link>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 12,
        border: `1px dashed ${appColors.grayEBColor}`,
        background: appColors.grayF5Color,
        color: appColors.gray80Color,
        textAlign: 'center',
      }}
    >
      Không có ảnh đính kèm
    </div>
  )
}

export function ApprovalRequestCard({
  item,
  isDeciding,
  onApprove,
  onReject,
}: ApprovalRequestCardProps) {
  const isSos = item.kind === 'SOS'

  return (
    <Card
      styles={{ body: { paddingTop: 16 } }}
      title={
        <Space wrap size={8}>
          <ApprovalKindTag kind={item.kind} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {item.targetId}
          </Typography.Text>
        </Space>
      }
      extra={<ApprovalStatusTag status={item.status} />}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <AttachmentPreview item={item} />

        <div>
          <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
            {isSos ? item.description : item.teamName}
          </Typography.Title>
          {isSos && item.eventType ? (
            <Typography.Paragraph style={{ marginBottom: 8 }}>
              Loại: <SosTypeText type={item.eventType} />
            </Typography.Paragraph>
          ) : null}
        </div>

        <Descriptions column={1} size="small" bordered>
          {isSos ? null : (
            <>
              <Descriptions.Item label="Tên đội">{item.teamName ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Tổ chức">{item.organizational ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Quy mô">{item.sizeMember ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Email">{item.email ?? '—'}</Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Người gửi">{item.requester}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {item.phone ? formatPhone(item.phone) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm">{item.location}</Descriptions.Item>
          {item.province ? (
            <Descriptions.Item label="Tỉnh/TP">{item.province}</Descriptions.Item>
          ) : null}
          {item.lat != null && item.lon != null ? (
            <Descriptions.Item label="Tọa độ">
              {item.lat}, {item.lon}
            </Descriptions.Item>
          ) : null}
          {item.llmScore != null ? (
            <Descriptions.Item label="Điểm AI">
              {(item.llmScore * 100).toFixed(0)}%
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item label="Thời gian">{formatDateTime(item.createdAt)}</Descriptions.Item>
        </Descriptions>

        {item.status === 'PENDING' ? (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <CustomButton
              buttonText="Duyệt"
              disabled={isDeciding}
              onPressed={() => onApprove(item)}
            />
            <CustomButton
              variant="danger"
              buttonText="Từ chối"
              disabled={isDeciding}
              onPressed={() => onReject(item)}
            />
          </Space>
        ) : null}
      </Space>
    </Card>
  )
}

import { Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { sosDetailPath } from '../../../app/config/routes'
import { PageHeader } from '../../../components/shared/PageHeader'
import { PaginatedTable } from '../../../components/shared/PaginatedTable'
import { QueryState } from '../../../components/shared/QueryState'
import { CustomButton } from '../../../components/ui/CustomButton'
import { SosStatusTag, SosTypeText } from '../../../components/ui/StatusTag'
import type { SosRecord } from '../../../types/domain'
import { formatDateTime, formatPhone } from '../../../utils/format'
import { getSosStatusLabel } from '../../../utils/status'
import { useSosListPage } from '../hooks/useSosListPage'
import { i18nStore } from '../../../app/i18n/i18nStore'
import { useT } from '../../../app/i18n/useT'

export function SosListPage() {
  const navigate = useNavigate()
  const pageState = useSosListPage()
  const lang = i18nStore((s) => s.lang)
  const t = useT()

  const columns: ColumnsType<SosRecord> = [
    { title: 'Mã', dataIndex: 'id', minWidth: 120 },
    { title: 'Mô tả', dataIndex: 'description', minWidth: 180 },
    {
      title: 'Loại',
      dataIndex: 'eventType',
      width: 110,
      render: (value: SosRecord['eventType']) => <SosTypeText type={value} />,
    },
    {
      title: 'Người gửi',
      minWidth: 140,
      render: (_, record) => (
        <div>
          <div>{formatPhone(record.phone)}</div>
        </div>
      ),
    },
    { title: 'Địa điểm', dataIndex: 'locationName', minWidth: 200 },
    {
      title: 'Thời gian',
      dataIndex: 'eventTime',
      width: 160,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (value: SosRecord['status']) => <SosStatusTag status={value} />,
    },
    {
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <CustomButton
          isFullWidth={false}
          variant="secondary"
          buttonText="Chi tiết"
          onPressed={() => navigate(sosDetailPath(record.id))}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('page.sosList.title')}
        description="Danh sách sự kiện SOS từ API /admin/all-events (có phân trang)."
      />
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder={t('page.sosList.searchPlaceholder')}
          defaultValue={pageState.query}
          onSearch={pageState.setQuery}
          style={{ width: 280 }}
        />
        <Select
          value={pageState.status}
          style={{ width: 200 }}
          onChange={pageState.setStatus}
          options={[
            { value: 'ALL', label: t('page.sosList.statusAllLabel') },
            ...pageState.filterStatuses.map((status) => ({
              value: status,
              label: getSosStatusLabel(lang, status),
            })),
          ]}
        />
      </Space>
      <QueryState
        isLoading={pageState.isLoading}
        isError={pageState.isError}
        errorMessage={pageState.errorMessage}
        isEmpty={!pageState.data?.items.length}
        emptyDescription="Không có yêu cầu SOS phù hợp bộ lọc."
      >
        <PaginatedTable
          rowKey="id"
          columns={columns}
          data={pageState.data}
          onPageChange={pageState.setPage}
          scroll={{ x: 'max-content' }}
        />
      </QueryState>
    </>
  )
}

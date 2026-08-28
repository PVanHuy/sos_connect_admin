import type { ColumnsType } from 'antd/es/table'
import { PageHeader } from '../../../components/shared/PageHeader'
import { PaginatedTable } from '../../../components/shared/PaginatedTable'
import { QueryState } from '../../../components/shared/QueryState'
import type { AuditLog } from '../../../types/domain'
import { formatDateTime } from '../../../utils/format'
import { useAuditLogsPage } from '../hooks/useAuditLogsPage'

export function AuditLogsPage() {
  const pageState = useAuditLogsPage()

  const columns: ColumnsType<AuditLog> = [
    { title: 'Mã', dataIndex: 'id', minWidth: 120 },
    { title: 'Admin ID', dataIndex: 'actor', minWidth: 160 },
    { title: 'Hành động', dataIndex: 'action', minWidth: 180 },
    { title: 'Metadata', dataIndex: 'target', minWidth: 160 },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
  ]

  return (
    <>
      <PageHeader
        title="Nhật ký kiểm toán"
        description="Lịch sử thao tác admin từ API /admin/logs (có phân trang)."
      />
      <QueryState
        isLoading={pageState.isLoading}
        isError={pageState.isError}
        errorMessage={pageState.errorMessage}
        isEmpty={!pageState.data?.items.length}
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

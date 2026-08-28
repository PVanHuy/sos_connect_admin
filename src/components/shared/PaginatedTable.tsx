import { Table } from 'antd'
import type { TableProps } from 'antd'
import { getTablePaginationProps } from '../../lib/api/pagination'
import type { PaginatedResult } from '../../types/domain'

interface PaginatedTableProps<T extends object> extends Omit<TableProps<T>, 'pagination' | 'dataSource'> {
  data?: PaginatedResult<T>
  onPageChange: (page: number, pageSize: number) => void
}

export function PaginatedTable<T extends object>({
  data,
  onPageChange,
  ...tableProps
}: PaginatedTableProps<T>) {
  return (
    <Table
      className="paginated-table"
      {...tableProps}
      dataSource={data?.items}
      pagination={{
        ...getTablePaginationProps(data),
        onChange: onPageChange,
      }}
    />
  )
}

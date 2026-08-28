import { Input, Select, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageHeader } from '../../../components/shared/PageHeader'
import { PaginatedTable } from '../../../components/shared/PaginatedTable'
import { QueryState } from '../../../components/shared/QueryState'
import { RoleTag } from '../../../components/ui/StatusTag'
import type { AdminUser } from '../../../types/domain'
import { formatPhone } from '../../../utils/format'
import { getUserFilterOptions } from '../constants/userFilterOptions'
import { useUsersPage } from '../hooks/useUsersPage'

export function UsersPage() {
  const pageState = useUsersPage()
  const roleFilterOptions = getUserFilterOptions()

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Tên',
      dataIndex: 'username',
      minWidth: 140,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      minWidth: 200,
      render: (value: string) => value || '—',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 140,
      render: (value: string) => (value && value !== '—' ? formatPhone(value) : '—'),
    },
    {
      title: 'Tỉnh/TP',
      dataIndex: 'province',
      minWidth: 120,
      render: (value?: string) => value ?? '—',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      minWidth: 200,
      render: (value?: string) => value ?? '—',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 120,
      render: (value: string) => <RoleTag role={value} />,
    },
  ]

  return (
    <>
      <PageHeader title="Người dùng" description="Danh sách tài khoản từ API /admin/users (có phân trang)." />
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder="Tìm username, email, SĐT"
          value={pageState.searchInput}
          onChange={(event) => pageState.setSearchInput(event.target.value)}
          onSearch={pageState.applyQuery}
          loading={pageState.isFetching}
          style={{ width: 300 }}
        />
        <Select
          value={pageState.role}
          style={{ width: 200 }}
          onChange={pageState.setRole}
          options={[
            { value: 'ALL', label: 'Tất cả vai trò' },
            ...roleFilterOptions,
          ]}
        />
      </Space>
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

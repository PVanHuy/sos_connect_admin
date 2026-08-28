import { Button, Input, Select, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageHeader } from '../../../components/shared/PageHeader'
import { PaginatedTable } from '../../../components/shared/PaginatedTable'
import { QueryState } from '../../../components/shared/QueryState'
import { RoleTag, TeamStatusTag } from '../../../components/ui/StatusTag'
import type { RescueTeam } from '../../../types/domain'
import { formatDateTime, formatPhone } from '../../../utils/format'
import { TEAM_STATUSES, getTeamStatusLabel } from '../../../utils/status'
import { useRescueTeamsPage } from '../hooks/useRescueTeamsPage'
import { i18nStore } from '../../../app/i18n/i18nStore'
import { useT } from '../../../app/i18n/useT'

function formatTeamArea(team: RescueTeam): string {
  return [team.commune, team.district, team.province].filter(Boolean).join(', ')
}

export function RescueTeamsPage() {
  const pageState = useRescueTeamsPage()
  const lang = i18nStore((s) => s.lang)
  const t = useT()

  const columns: ColumnsType<RescueTeam> = [
    { title: 'Tên đội', dataIndex: 'name', minWidth: 160 },
    {
      title: 'Khu vực',
      minWidth: 180,
      render: (_, record) => formatTeamArea(record),
    },
    { title: 'Quy mô', dataIndex: 'sizeMember', width: 90 },
    {
      title: 'Tổ chức',
      dataIndex: 'organizational',
      minWidth: 140,
      render: (v?: string | null) => v ?? '—',
    },
    { title: 'Đội trưởng', dataIndex: 'leader', minWidth: 140 },
    { title: 'SĐT', dataIndex: 'phone', width: 130, render: (value: string) => formatPhone(value) },
    {
      title: 'Email',
      dataIndex: 'email',
      minWidth: 200,
      render: (value?: string | null) => value ?? '—',
    },
    {
      title: 'Vai trò',
      dataIndex: 'position',
      width: 130,
      render: (value?: string | null) => (value ? <RoleTag role={value} /> : '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (value: RescueTeam['status']) => <TeamStatusTag status={value} />,
    },
    {
      title: 'Giấy tờ',
      dataIndex: 'documentUrl',
      width: 90,
      render: (value?: string | null) =>
        value ? (
          <Typography.Link href={value} target="_blank" rel="noreferrer">
            Xem
          </Typography.Link>
        ) : (
          '—'
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 160,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Button
            size="small"
            block
            disabled={pageState.isMutating}
            onClick={() => pageState.openChangeStatus(record)}
          >
            Đổi trạng thái
          </Button>
          <Button
            size="small"
            block
            danger
            disabled={pageState.isMutating}
            onClick={() => pageState.confirmDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('page.rescueTeams.title')}
        description="Danh sách đội cứu hộ từ API /admin/teams (có phân trang)."
      />
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder="Tìm tên đội, đội trưởng"
          defaultValue={pageState.query}
          onSearch={pageState.setQuery}
          style={{ width: 280 }}
        />
        <Select
          value={pageState.status}
          style={{ width: 180 }}
          onChange={pageState.setStatus}
          options={[
            { value: 'ALL', label: t('page.sosList.statusAllLabel') },
            ...TEAM_STATUSES.map((status) => ({
              value: status,
              label: getTeamStatusLabel(lang, status),
            })),
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

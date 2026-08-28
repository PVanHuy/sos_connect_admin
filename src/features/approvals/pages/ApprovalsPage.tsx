import { Pagination, Tabs } from 'antd'
import { PageHeader } from '../../../components/shared/PageHeader'
import { QueryState } from '../../../components/shared/QueryState'
import { useT } from '../../../app/i18n/useT'
import { ApprovalRequestCard } from '../components/ApprovalRequestCard'
import { useApprovalsPage } from '../hooks/useApprovalsPage'

export function ApprovalsPage() {
  const t = useT()
  const {
    tab,
    setTab,
    items,
    data,
    page,
    pageSize,
    isLoading,
    isError,
    errorMessage,
    isDeciding,
    confirmApprove,
    confirmReject,
    setPage,
  } = useApprovalsPage()

  return (
    <>
      <PageHeader title={t('page.approvals.title')} description={t('page.approvals.description')} />
      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as typeof tab)}
        style={{ marginBottom: 8 }}
        items={[
          { key: 'ALL', label: t('page.approvals.tabAll') },
          { key: 'RESCUE_TEAM', label: t('page.approvals.tabTeam') },
          { key: 'SOS', label: t('page.approvals.tabSos') },
        ]}
      />
      <QueryState isLoading={isLoading} isError={isError} errorMessage={errorMessage} isEmpty={!items.length}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {items.map((item) => (
            <ApprovalRequestCard
              key={item.id}
              item={item}
              isDeciding={isDeciding}
              onApprove={confirmApprove}
              onReject={confirmReject}
            />
          ))}
        </div>
        {data ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={data.total}
              showSizeChanger
              onChange={setPage}
              showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} mục`}
            />
          </div>
        ) : null}
      </QueryState>
    </>
  )
}

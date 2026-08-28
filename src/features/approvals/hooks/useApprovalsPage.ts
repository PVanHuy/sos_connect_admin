import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { createElement, useRef, useState } from 'react'
import { RejectReasonFields } from '../../../components/shared/RejectReasonFields'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import type { ApprovalRequest } from '../../../types/domain'
import type { ApprovalKind } from '../../../utils/status'
import {
  approveApproval,
  fetchApprovals,
  rejectApproval,
  type ApprovalsTab,
} from '../api/approvals.api'

export type { ApprovalsTab }

export function useApprovalsPage() {
  const { modal, message } = App.useApp()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<ApprovalsTab>('ALL')
  const rejectReasonRef = useRef('')
  const { page, pageSize, setPage } = useUrlPagination({ defaultPageSize: 10 })

  const listQuery = useQuery({
    queryKey: ['approvals', 'list', { tab, page, pageSize }],
    queryFn: () => fetchApprovals({ kind: tab, page, pageSize }),
  })

  async function invalidateApprovalQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['approvals'] }),
      queryClient.invalidateQueries({ queryKey: ['rescue-teams'] }),
      queryClient.invalidateQueries({ queryKey: ['sos'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] }),
    ])
  }

  const approveMutation = useMutation({
    mutationFn: (item: ApprovalRequest) => approveApproval(item),
    onSuccess: async () => {
      await invalidateApprovalQueries()
      message.success('Đã phê duyệt yêu cầu.')
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ item, reason }: { item: ApprovalRequest; reason: string }) =>
      rejectApproval(item, reason),
    onSuccess: async () => {
      await invalidateApprovalQueries()
      message.success('Đã từ chối yêu cầu.')
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  function confirmApprove(item: ApprovalRequest) {
    const kindLabel =
      item.kind === 'RESCUE_TEAM' ? 'đăng ký đội cứu hộ' : 'yêu cầu SOS'

    modal.confirm({
      title: 'Xác nhận duyệt',
      content: `Bạn sẽ duyệt ${kindLabel} “${item.title}”.`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await approveMutation.mutateAsync(item)
        } catch {
          return Promise.reject(new Error('approve_failed'))
        }
      },
    })
  }

  function confirmReject(item: ApprovalRequest) {
    rejectReasonRef.current = ''
    const kindLabel =
      item.kind === 'RESCUE_TEAM' ? 'đội cứu hộ' : 'yêu cầu SOS'

    modal.confirm({
      title: 'Từ chối yêu cầu',
      content: createElement(RejectReasonFields, {
        label: `Nhập lý do từ chối ${kindLabel}. Lý do sẽ được gửi cho người dùng.`,
        placeholder: 'Ví dụ: Thông tin không hợp lệ',
        onChange: (reason: string) => {
          rejectReasonRef.current = reason
        },
      }),
      okText: 'Từ chối',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        const reason = rejectReasonRef.current.trim()
        if (!reason) {
          message.error('Vui lòng nhập lý do từ chối.')
          return Promise.reject(new Error('missing_reject_reason'))
        }
        try {
          await rejectMutation.mutateAsync({ item, reason })
        } catch {
          return Promise.reject(new Error('reject_failed'))
        }
      },
    })
  }

  return {
    tab,
    setTab: (next: ApprovalKind | 'ALL') => {
      setTab(next)
      setPage(1, pageSize)
    },
    items: listQuery.data?.items ?? [],
    data: listQuery.data,
    page,
    pageSize,
    pendingCount: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    errorMessage: listQuery.error ? getUserFacingErrorMessage(toAppError(listQuery.error)) : undefined,
    isDeciding: approveMutation.isPending || rejectMutation.isPending,
    confirmApprove,
    confirmReject,
    setPage,
  }
}

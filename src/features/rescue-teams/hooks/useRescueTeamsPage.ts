import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { createElement, useRef } from 'react'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import type { RescueTeam } from '../../../types/domain'
import { normalizeTeamStatus, type TeamStatus } from '../../../utils/status'
import { i18nStore } from '../../../app/i18n/i18nStore'
import {
  deleteRescueTeam,
  fetchRescueTeams,
  updateRescueTeamStatus,
} from '../api/rescueTeams.api'
import { TeamDeleteFields } from '../components/TeamDeleteFields'
import { TeamStatusChangeFields } from '../components/TeamStatusChangeFields'

function parseStatus(value: string | null): TeamStatus | 'ALL' {
  if (!value || value === 'ALL') return 'ALL'
  return normalizeTeamStatus(value) ?? 'ALL'
}

export function useRescueTeamsPage() {
  const { modal, message } = App.useApp()
  const queryClient = useQueryClient()
  const lang = i18nStore((s) => s.lang)
  const { page, pageSize, params, setParams, setPage } = useUrlPagination({ defaultPageSize: 10 })
  const status = parseStatus(params.get('status'))
  const query = params.get('q') ?? ''
  const pendingStatusRef = useRef<TeamStatus>('pending')
  const deleteReasonRef = useRef('')

  const listQuery = useQuery({
    queryKey: ['rescue-teams', 'list', { status, query, page, pageSize }],
    queryFn: () => fetchRescueTeams({ status, query, page, pageSize }),
  })

  async function invalidateTeamQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['rescue-teams'] }),
      queryClient.invalidateQueries({ queryKey: ['approvals'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ])
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: TeamStatus }) =>
      updateRescueTeamStatus(id, nextStatus),
    onSuccess: async () => {
      await invalidateTeamQueries()
      message.success('Đã cập nhật trạng thái đội cứu hộ.')
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => deleteRescueTeam(id, message),
    onSuccess: async () => {
      await invalidateTeamQueries()
      message.success('Đã xóa đội cứu hộ.')
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  function openChangeStatus(team: RescueTeam) {
    pendingStatusRef.current = team.status
    modal.confirm({
      title: `Đổi trạng thái: ${team.name}`,
      content: createElement(TeamStatusChangeFields, {
        value: team.status,
        lang,
        onChange: (nextStatus: TeamStatus) => {
          pendingStatusRef.current = nextStatus
        },
      }),
      okText: 'Lưu',
      cancelText: 'Hủy',
      onOk: async () => {
        if (pendingStatusRef.current === team.status) return
        try {
          await updateStatusMutation.mutateAsync({
            id: team.id,
            nextStatus: pendingStatusRef.current,
          })
        } catch {
          return Promise.reject(new Error('update_team_status_failed'))
        }
      },
    })
  }

  function confirmDelete(team: RescueTeam) {
    deleteReasonRef.current = ''
    modal.confirm({
      title: 'Xóa đội cứu hộ',
      content: createElement(TeamDeleteFields, {
        onChange: (reason: string) => {
          deleteReasonRef.current = reason
        },
      }),
      okText: 'Xóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        const reason = deleteReasonRef.current.trim()
        if (!reason) {
          message.error('Vui lòng nhập lý do xóa.')
          return Promise.reject(new Error('missing_delete_reason'))
        }
        try {
          await deleteMutation.mutateAsync({ id: team.id, message: reason })
        } catch {
          return Promise.reject(new Error('delete_team_failed'))
        }
      },
    })
  }

  return {
    status,
    query,
    page,
    pageSize,
    data: listQuery.data,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    errorMessage: listQuery.error ? getUserFacingErrorMessage(toAppError(listQuery.error)) : undefined,
    isMutating: updateStatusMutation.isPending || deleteMutation.isPending,
    openChangeStatus,
    confirmDelete,
    setStatus: (next: TeamStatus | 'ALL') => {
      const nextParams = new URLSearchParams(params)
      if (next === 'ALL') nextParams.delete('status')
      else nextParams.set('status', next)
      nextParams.set('page', '1')
      setParams(nextParams)
    },
    setQuery: (next: string) => {
      const nextParams = new URLSearchParams(params)
      if (next) nextParams.set('q', next)
      else nextParams.delete('q')
      nextParams.set('page', '1')
      setParams(nextParams)
    },
    setPage,
  }
}

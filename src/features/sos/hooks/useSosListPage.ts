import { useQuery } from '@tanstack/react-query'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import { normalizeSosStatus, type SosStatus } from '../../../utils/status'
import { fetchSosList } from '../api/sos.api'

const SOS_LIST_FILTER_STATUSES = ['REQUESTED', 'PENDING', 'COMPLETE', 'REJECTED'] as const

export type SosListFilterStatus = (typeof SOS_LIST_FILTER_STATUSES)[number]

function parseStatus(value: string | null): SosListFilterStatus | 'ALL' {
  if (!value || value === 'ALL') return 'ALL'
  const normalized = normalizeSosStatus(value)
  if (normalized && (SOS_LIST_FILTER_STATUSES as readonly string[]).includes(normalized)) {
    return normalized as SosListFilterStatus
  }
  return 'ALL'
}

export function useSosListPage() {
  const { page, pageSize, params, setParams, setPage } = useUrlPagination({ defaultPageSize: 10 })
  const status = parseStatus(params.get('status'))
  const query = params.get('q') ?? ''

  const listQuery = useQuery({
    queryKey: ['sos', 'list', { status, query, page, pageSize }],
    queryFn: () =>
      fetchSosList({
        status: status === 'ALL' ? 'ALL' : (status as SosStatus),
        query,
        page,
        pageSize,
      }),
  })

  return {
    status,
    query,
    page,
    pageSize,
    data: listQuery.data,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    errorMessage: listQuery.error ? getUserFacingErrorMessage(toAppError(listQuery.error)) : undefined,
    filterStatuses: SOS_LIST_FILTER_STATUSES,
    setStatus: (next: SosListFilterStatus | 'ALL') => {
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

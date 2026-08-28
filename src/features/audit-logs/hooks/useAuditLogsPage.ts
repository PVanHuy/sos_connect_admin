import { useQuery } from '@tanstack/react-query'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import { fetchAuditLogs } from '../api/auditLogs.api'

export function useAuditLogsPage() {
  const { page, pageSize, setPage } = useUrlPagination({ defaultPageSize: 10 })

  const query = useQuery({
    queryKey: ['audit-logs', 'list', { page, pageSize }],
    queryFn: () => fetchAuditLogs({ page, pageSize }),
  })

  return {
    data: query.data,
    page,
    pageSize,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getUserFacingErrorMessage(toAppError(query.error)) : undefined,
    setPage,
  }
}

import { useQuery } from '@tanstack/react-query'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { fetchDashboardStats } from '../api/dashboard.api'

export const dashboardQueryKey = ['dashboard', 'stats'] as const

export function useDashboardPage() {
  const query = useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboardStats,
  })

  return {
    stats: query.data?.stats,
    trends: query.data?.trends,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getUserFacingErrorMessage(toAppError(query.error)) : undefined,
  }
}

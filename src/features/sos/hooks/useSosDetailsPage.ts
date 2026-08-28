import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { fetchSosDetail } from '../api/sos.api'

export function useSosDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const query = useQuery({
    queryKey: ['sos', 'detail', id],
    queryFn: () => fetchSosDetail(id ?? ''),
    enabled: Boolean(id),
  })

  return {
    id,
    record: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getUserFacingErrorMessage(toAppError(query.error)) : undefined,
  }
}

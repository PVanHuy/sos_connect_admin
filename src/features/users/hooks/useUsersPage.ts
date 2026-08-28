import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import { fetchUsers } from '../api/users.api'
import { parseUserFilterRole, type UserFilterRole } from '../constants/userFilterOptions'

export function useUsersPage() {
  const { page, pageSize, params, setParams, setPage } = useUrlPagination({ defaultPageSize: 10 })
  const role = parseUserFilterRole(params.get('role'))
  const query = params.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const listQuery = useQuery({
    queryKey: ['users', 'list', { role, query, page, pageSize }],
    queryFn: () =>
      fetchUsers({
        role: role === 'ALL' ? undefined : role,
        query,
        page,
        pageSize,
      }),
  })

  function applyQuery(next: string) {
    const nextParams = new URLSearchParams(params)
    const trimmed = next.trim()
    if (trimmed) nextParams.set('q', trimmed)
    else nextParams.delete('q')
    nextParams.set('page', '1')
    setParams(nextParams)
  }

  return {
    role,
    query,
    searchInput,
    setSearchInput,
    page,
    pageSize,
    data: listQuery.data,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    errorMessage: listQuery.error ? getUserFacingErrorMessage(toAppError(listQuery.error)) : undefined,
    setRole: (next: UserFilterRole | 'ALL') => {
      const nextParams = new URLSearchParams(params)
      if (next === 'ALL') nextParams.delete('role')
      else nextParams.set('role', next)
      nextParams.set('page', '1')
      setParams(nextParams)
    },
    applyQuery,
    setPage,
  }
}

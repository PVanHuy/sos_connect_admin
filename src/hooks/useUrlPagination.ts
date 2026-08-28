import { useSearchParams } from 'react-router-dom'

interface UseUrlPaginationOptions {
  defaultPageSize?: number
}

export function useUrlPagination({ defaultPageSize = 10 }: UseUrlPaginationOptions = {}) {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') ?? '1') || 1
  const pageSize = Number(params.get('pageSize') ?? String(defaultPageSize)) || defaultPageSize

  function setPage(nextPage: number, nextPageSize: number) {
    const nextParams = new URLSearchParams(params)
    nextParams.set('page', String(nextPage))
    nextParams.set('pageSize', String(nextPageSize))
    setParams(nextParams)
  }

  function resetPage() {
    const nextParams = new URLSearchParams(params)
    nextParams.set('page', '1')
    setParams(nextParams)
  }

  return {
    page,
    pageSize,
    params,
    setParams,
    setPage,
    resetPage,
  }
}

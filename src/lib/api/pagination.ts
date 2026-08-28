import { z } from 'zod'
import type { PaginatedResult } from '../../types/domain'

/** Pagination shape từ backend (snake_case). */
export const apiPaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total_items: z.number(),
  total_pages: z.number(),
})

export type ApiPagination = z.infer<typeof apiPaginationSchema>

export function mapApiPaginationToResult<T>(
  items: T[],
  pagination: ApiPagination,
): PaginatedResult<T> {
  return {
    items,
    page: pagination.page,
    pageSize: pagination.limit,
    total: pagination.total_items,
    totalPages: pagination.total_pages,
  }
}

export function getTablePaginationProps(result?: PaginatedResult<unknown>) {
  return {
    current: result?.page ?? 1,
    pageSize: result?.pageSize ?? 10,
    total: result?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} / ${total} mục`,
  }
}

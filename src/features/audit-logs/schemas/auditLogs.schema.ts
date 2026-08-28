import { z } from 'zod'
import { apiPaginationSchema } from '../../../lib/api/pagination'

export const auditLogApiSchema = z.object({
  id: z.string(),
  action: z.string(),
  admin_id: z.string(),
  timestamp: z.string(),
  metadata: z.unknown().nullable().optional(),
})

export const auditLogsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(auditLogApiSchema),
  pagination: apiPaginationSchema,
})

export type AuditLogApiDto = z.infer<typeof auditLogApiSchema>

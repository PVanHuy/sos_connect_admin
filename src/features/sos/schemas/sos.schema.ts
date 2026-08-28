import { z } from 'zod'
import { apiPaginationSchema } from '../../../lib/api/pagination'
import { normalizeSosEventType, normalizeSosStatus } from '../../../utils/status'
import type { SosEventType, SosStatus } from '../../../utils/status'

export const sosApiSchema = z.object({
  id: z.string(),
  userid: z.string().optional(),
  type: z.string(),
  description: z.string(),
  lat: z.number(),
  lon: z.number(),
  address_text: z.string(),
  phone: z.string(),
  image: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  teamId: z.string().nullable().optional(),
  status: z.string(),
  province: z.string().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),
  llm_score: z.number().nullable().optional(),
})

export const sosListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(sosApiSchema),
  pagination: apiPaginationSchema,
})

export const sosMutationResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: sosApiSchema.optional(),
})

export type SosApiDto = z.infer<typeof sosApiSchema>

export function parseSosStatus(value: string): SosStatus {
  return normalizeSosStatus(value) ?? 'PENDING'
}

export function parseSosEventType(value: string): SosEventType {
  return normalizeSosEventType(value) ?? 'OTHER'
}

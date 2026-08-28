import { z } from 'zod'
import { apiPaginationSchema } from '../../../lib/api/pagination'
import { normalizeTeamStatus, type TeamStatus } from '../../../utils/status'

export const teamApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  province: z.string(),
  district: z.string().nullable().optional(),
  commune: z.string(),
  size_member: z.string(),
  organizational: z.string().nullable().optional(),
  leader: z.string(),
  phone: z.string(),
  position: z.string().nullable().optional(),
  document_url: z.string().nullable().optional(),
  leader_id: z.string().nullable().optional(),
  created_at: z.string(),
  team_status: z.string(),
  email: z.string().nullable().optional(),
  team_lat: z.number().nullable().optional(),
  team_lon: z.number().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),
  delete_reason: z.string().nullable().optional(),
})

export const teamsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(teamApiSchema),
  pagination: apiPaginationSchema,
})

export const teamMutationResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: teamApiSchema.optional(),
})

export type TeamApiDto = z.infer<typeof teamApiSchema>

export function parseTeamStatus(value: string): TeamStatus {
  return normalizeTeamStatus(value) ?? 'pending'
}

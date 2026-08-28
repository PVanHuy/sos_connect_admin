import { z } from 'zod'
import { apiPaginationSchema } from '../../../lib/api/pagination'

export const userApiSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  roles: z.string(),
  team_id: z.union([z.string(), z.number()]).nullable().optional(),
  email: z.string().nullable().optional(),
  cccd: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
})

export const usersListResponseSchema = z.object({
  success: z.boolean(),
  users: z.array(userApiSchema),
  pagination: apiPaginationSchema,
})

export type UserApiDto = z.infer<typeof userApiSchema>
export type UsersListResponseDto = z.infer<typeof usersListResponseSchema>

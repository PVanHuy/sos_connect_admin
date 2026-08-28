import { z } from 'zod'
import { loginPasswordSchema, phoneSchema } from '../../../utils/validation'

export const loginFormSchema = z.object({
  phone: phoneSchema,
  password: loginPasswordSchema,
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const loginUserSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  username: z.string(),
  phone: z.string(),
  roles: z.string(),
  avatar: z.string().nullable().optional(),
  dob: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  team_id: z.union([z.string(), z.number()]).nullable().optional().transform((value) =>
    value == null ? undefined : String(value),
  ),
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional().default(''),
  access_token: z.string().optional(),
  user: loginUserSchema.optional(),
})

export type LoginResponseDto = z.infer<typeof loginResponseSchema>

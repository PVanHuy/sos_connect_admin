import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().min(1, 'VITE_API_URL is required'),
  VITE_SOCKET_URL: z.string().min(1, 'VITE_SOCKET_URL is required'),
  VITE_MAP_STYLE_URL: z.string().optional().default(''),
})

export type AppEnv = z.infer<typeof envSchema>

export function getAppEnv(): AppEnv {
  const parsed = envSchema.pick({
    VITE_API_URL: true,
    VITE_SOCKET_URL: true,
    VITE_MAP_STYLE_URL: true,
  }).safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
    VITE_MAP_STYLE_URL: import.meta.env.VITE_MAP_STYLE_URL ?? '',
  })
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join('; ')
    throw new Error(`Invalid environment configuration: ${details}`)
  }
  return parsed.data
}

export const appEnv = getAppEnv()

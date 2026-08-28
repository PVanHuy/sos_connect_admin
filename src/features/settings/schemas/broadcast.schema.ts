import { z } from 'zod'

export const broadcastSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề không được để trống'),
  content: z.string().trim().min(1, 'Nội dung không được để trống'),
  image_url: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\/.+/.test(value), 'URL ảnh không hợp lệ'),
})

export type BroadcastFormValues = z.infer<typeof broadcastSchema>

export const broadcastResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  total_users: z.number().optional(),
  sent: z.number().optional(),
  failed: z.number().optional(),
})

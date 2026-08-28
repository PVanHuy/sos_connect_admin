import { z } from 'zod'
import {
  isValidPersonName,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequiredField,
} from './customValidator'
import { validationMessages } from './messages'

function zodFromValidator(validate: (value: string) => string) {
  return z.string().superRefine((value, ctx) => {
    const message = validate(value)
    if (message) {
      ctx.addIssue({ code: 'custom', message })
    }
  })
}

/** SĐT VN — logic giống mobile CustomValidator.validatePhone */
export const phoneSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(zodFromValidator((value) => validatePhone(value, true)))

/** Mật khẩu đăng nhập: chỉ bắt buộc (giống mobile SignInController). */
export const loginPasswordSchema = zodFromValidator((value) => validateRequiredField(value, 'Mật khẩu'))

/** Mật khẩu mạnh khi đăng ký/đổi mật khẩu. */
export const passwordSchema = zodFromValidator(validatePassword)

export const personNameSchema = z
  .string()
  .trim()
  .min(1, validationMessages.fieldRequired('Tên'))
  .refine(isValidPersonName, validationMessages.name)

export const emailSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const message = validateEmail(value, true)
    if (message) ctx.addIssue({ code: 'custom', message })
  })

export const usernameSchema = z
  .string()
  .trim()
  .min(3, validationMessages.username)
  .max(32, validationMessages.username)
  .regex(/^[a-zA-Z0-9._]+$/, validationMessages.username)

export const requiredTextSchema = z
  .string()
  .trim()
  .min(1, validationMessages.fieldRequired('Trường này'))

export { isValidVnPhone, isValidPersonName } from './customValidator'
export { validationMessages } from './messages'

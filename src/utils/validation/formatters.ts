import { validationConstants } from './constants'

function removeDiacritics(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '')
}

function collapseDoubleSpaces(value: string): string {
  return value.replace(/ {2,}/g, ' ')
}

function trimLeadingSpace(value: string): string {
  return value.replace(/^\s+/, '')
}

/** Chỉ cho nhập chữ cái + khoảng trắng (có dấu tiếng Việt), tối đa 25 ký tự. */
export function formatFullNameInput(value: string): string {
  return collapseDoubleSpaces(
    trimLeadingSpace(value.replace(/[^a-zA-Z\sÀ-ỹ]/g, '')),
  ).slice(0, 25)
}

/** Chỉ số, tối đa 10 ký tự — giống mobile phoneFormatter. */
export function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, validationConstants.maxPhoneLength)
}

/** Không dấu, không khoảng trắng, tối đa 50 ký tự — giống mobile passwordFormatter. */
export function formatPasswordInput(value: string): string {
  return removeDiacritics(value).replace(/\s/g, '').slice(0, validationConstants.maxPasswordLength)
}

/** Không dấu, không khoảng trắng, tối đa 50 ký tự. */
export function formatEmailInput(value: string): string {
  return removeDiacritics(value).replace(/\s/g, '').slice(0, 50)
}

/** Tiêu đề / ghi chú ngắn: không double-space đầu dòng, giới hạn độ dài. */
export function formatTitleInput(value: string, maxLength = 50): string {
  return collapseDoubleSpaces(trimLeadingSpace(value)).slice(0, maxLength)
}

export function formatNotesInput(value: string): string {
  return formatTitleInput(value, validationConstants.maxNameLength)
}

/** Tìm kiếm: chữ, số, khoảng trắng tiếng Việt. */
export function formatSearchInput(value: string): string {
  return collapseDoubleSpaces(
    trimLeadingSpace(value.replace(/[^a-zA-Z0-9\sÀ-ỹ]/g, '')),
  ).slice(0, 50)
}

/** CCCD: chỉ số, tối đa 12. */
export function formatCccdInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 12)
}

/** Mã: chữ + số, không dấu, tối đa 20. */
export function formatCodeInput(value: string): string {
  return removeDiacritics(value)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 20)
}

/** Địa chỉ: không double-space đầu, tối đa 100. */
export function formatAddressInput(value: string): string {
  return collapseDoubleSpaces(trimLeadingSpace(value)).slice(0, validationConstants.maxAddressLength)
}

/** Chỉ số nguyên. */
export function formatNumberInput(value: string, maxLength = 20): string {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

/** Username/phone login field giống mobile userNameAndPhoneFormatter (không space đầu). */
export function formatUserNameAndPhoneInput(value: string): string {
  return trimLeadingSpace(value.replace(/[^a-zA-Z0-9!@#$&*~]/g, '')).slice(0, 20)
}

export const inputFormatters = {
  fullName: formatFullNameInput,
  phone: formatPhoneInput,
  password: formatPasswordInput,
  email: formatEmailInput,
  title: formatTitleInput,
  notes: formatNotesInput,
  search: formatSearchInput,
  cccd: formatCccdInput,
  code: formatCodeInput,
  address: formatAddressInput,
  number: formatNumberInput,
  userNameAndPhone: formatUserNameAndPhoneInput,
} as const

export type InputFormatterKey = keyof typeof inputFormatters

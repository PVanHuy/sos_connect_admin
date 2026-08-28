import { appColors } from '../../app/theme/colors'
import type { Language } from '../../app/i18n/i18nStore'

/** Trạng thái SOS từ API backend. */
export const SOS_STATUSES = [
  'REQUESTED',
  'PENDING',
  'COMPLETE',
  'REJECTED',
  'NEW',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'RESOLVED',
  'CANCELLED',
] as const

export type SosStatus = (typeof SOS_STATUSES)[number]

export const SOS_EVENT_TYPES = [
  'FOOD',
  'HELP',
  'ESSENTIAL',
  'OTHER',
  'FLOOD',
  'FIRE',
  'MEDICAL',
  'ACCIDENT',
] as const

export type SosEventType = (typeof SOS_EVENT_TYPES)[number]

export const sosStatusLabel: Record<SosStatus, string> = {
  REQUESTED: 'Chờ duyệt',
  PENDING: 'Đang chờ xử lý',
  COMPLETE: 'Hoàn thành',
  REJECTED: 'Từ chối',
  NEW: 'Mới',
  ACKNOWLEDGED: 'Đã tiếp nhận',
  IN_PROGRESS: 'Đang xử lý',
  RESOLVED: 'Đã giải quyết',
  CANCELLED: 'Đã hủy',
}

const sosStatusLabelByLang: Record<Language, Record<SosStatus, string>> = {
  vi: sosStatusLabel,
  en: {
    REQUESTED: 'Requested',
    PENDING: 'Pending',
    COMPLETE: 'Complete',
    REJECTED: 'Rejected',
    NEW: 'New',
    ACKNOWLEDGED: 'Acknowledged',
    IN_PROGRESS: 'In progress',
    RESOLVED: 'Resolved',
    CANCELLED: 'Cancelled',
  },
}

export const sosEventTypeLabel: Record<SosEventType, string> = {
  FOOD: 'Thực phẩm',
  HELP: 'Cứu hộ',
  ESSENTIAL: 'Thiết yếu',
  OTHER: 'Khác',
  FLOOD: 'Ngập lụt',
  FIRE: 'Hỏa hoạn',
  MEDICAL: 'Y tế',
  ACCIDENT: 'Tai nạn',
}

const sosEventTypeLabelByLang: Record<Language, Record<SosEventType, string>> = {
  vi: sosEventTypeLabel,
  en: {
    FOOD: 'Food',
    HELP: 'Help',
    ESSENTIAL: 'Essential',
    OTHER: 'Other',
    FLOOD: 'Flood',
    FIRE: 'Fire',
    MEDICAL: 'Medical',
    ACCIDENT: 'Accident',
  },
}

const unknownStatusColor = appColors.purpleFFColor

export function isSosStatus(value: string): value is SosStatus {
  return (SOS_STATUSES as readonly string[]).includes(value)
}

export function normalizeSosStatus(value: string): SosStatus | null {
  const normalized = value.trim().toUpperCase()
  return isSosStatus(normalized) ? normalized : null
}

export function isSosEventType(value: string): value is SosEventType {
  return (SOS_EVENT_TYPES as readonly string[]).includes(value)
}

export function normalizeSosEventType(value: string): SosEventType | null {
  const normalized = value.trim().toUpperCase()
  return isSosEventType(normalized) ? normalized : null
}

export function getSosStatusLabel(lang: Language, status: SosStatus): string {
  return sosStatusLabelByLang[lang][status]
}

export function getSosStatusLabelSafe(lang: Language, status: string): string {
  const normalized = normalizeSosStatus(status)
  return normalized ? getSosStatusLabel(lang, normalized) : status
}

export function getSosEventTypeLabel(lang: Language, type: SosEventType): string {
  return sosEventTypeLabelByLang[lang][type]
}

export function getSosEventTypeLabelSafe(lang: Language, type: string): string {
  const normalized = normalizeSosEventType(type)
  return normalized ? getSosEventTypeLabel(lang, normalized) : type
}

export const sosStatusColor: Record<SosStatus, string> = {
  REQUESTED: appColors.yellow22Color,
  PENDING: appColors.blue8FFColor,
  COMPLETE: appColors.green47Color,
  REJECTED: appColors.red26Color,
  NEW: appColors.yellow22Color,
  ACKNOWLEDGED: appColors.blue8FFColor,
  IN_PROGRESS: appColors.mintyWaveColor,
  RESOLVED: appColors.green47Color,
  CANCELLED: appColors.red26Color,
}

export function getSosStatusColorSafe(status: string): string {
  const normalized = normalizeSosStatus(status)
  return normalized ? sosStatusColor[normalized] : unknownStatusColor
}

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
})

const numberFormatter = new Intl.NumberFormat('vi-VN')

export function formatDateTime(value: string | Date | undefined): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTimeFormatter.format(date)
}

export function formatDate(value: string | Date | undefined): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

export function formatNumber(value: number | undefined): string {
  if (value === undefined) return '—'
  return numberFormatter.format(value)
}

export function formatPhone(value: string | undefined): string {
  if (!value) return '—'
  const digits = value.replace(/\s/g, '')
  if (digits.startsWith('+84') && digits.length === 12) {
    return `+84 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return value
}

export function formatPercent(value: number): string {
  return `${value}%`
}

export function emptyDisplay(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

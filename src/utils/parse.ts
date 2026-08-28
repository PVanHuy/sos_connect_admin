export function parseToBool(json: unknown): boolean {
  if (typeof json === 'boolean') return json
  if (typeof json === 'number') return json === 1
  if (typeof json === 'string') return json === '1' || json.toLowerCase() === 'true'
  return false
}

export function parseToInt(value: unknown): number | null {
  if (value === null || value === undefined) return null

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : null

  return null
}

export function parseToDouble(value: unknown): number | null {
  if (value === null || value === undefined) return null

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  if (typeof value === 'number') return Number.isFinite(value) ? value : null

  return null
}

export function parseToString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  return String(value)
}


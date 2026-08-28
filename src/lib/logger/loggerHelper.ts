export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogOptions = {
  error?: unknown
  stackTrace?: unknown
  name?: string
}

const STYLES = {
  info: 'color:#22c55e;font-weight:600',
  error: 'color:#ef4444;font-weight:600',
  warn: 'color:#eab308;font-weight:600',
  debug: 'color:#3b82f6;font-weight:600',
  cyan: 'color:#06b6d4;font-weight:600',
  magenta: 'color:#d946ef;font-weight:600',
  blue: 'color:#2563eb;font-weight:600',
  yellow: 'color:#ca8a04;font-weight:600',
  white: 'color:#f8fafc;font-weight:600',
} as const

export class LoggerHelper {
  private shouldLog(): boolean {
    return import.meta.env.DEV === true
  }

  private emit(
    level: LogLevel,
    message: string,
    style: string,
    meta?: unknown,
    name?: string,
  ) {
    if (!this.shouldLog()) return

    const prefix = name ? `[${name}] ` : ''
    const label = `[${level.toUpperCase()}] ${prefix}${message}`

    if (meta !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`%c${label}`, style, meta)
      return
    }

    // eslint-disable-next-line no-console
    console.log(`%c${label}`, style)
  }

  log(message: string, { name = '' }: LogOptions = {}) {
    this.emit('debug', message, STYLES.debug, undefined, name || undefined)
  }

  success(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('info', message, STYLES.info, error ?? stackTrace, name || undefined)
  }

  error(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('error', message, STYLES.error, error ?? stackTrace, name || undefined)
  }

  warn(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('warn', message, STYLES.warn, error ?? stackTrace, name || undefined)
  }

  debug(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('debug', message, STYLES.debug, error ?? stackTrace, name || undefined)
  }

  logWhite(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('info', message, STYLES.white, error ?? stackTrace, name || undefined)
  }

  logCyan(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('debug', message, STYLES.cyan, error ?? stackTrace, name || undefined)
  }

  logMagenta(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('debug', message, STYLES.magenta, error ?? stackTrace, name || undefined)
  }

  logBlue(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('debug', message, STYLES.blue, error ?? stackTrace, name || undefined)
  }

  logYellow(message: string, { error, stackTrace, name = '' }: LogOptions = {}) {
    this.emit('warn', message, STYLES.yellow, error ?? stackTrace, name || undefined)
  }

  logFullObject(data: unknown, { name = 'FullObject' }: { name?: string } = {}) {
    if (!this.shouldLog()) return

    let json = ''
    try {
      json = JSON.stringify(data, null, 2) ?? ''
    } catch (error) {
      this.error('Không thể stringify object để log', { error, name })
      return
    }

    const chunkSize = 800
    for (let i = 0; i < json.length; i += chunkSize) {
      const end = Math.min(i + chunkSize, json.length)
      this.log(json.slice(i, end), { name })
    }
  }
}

export const loggerHelper = new LoggerHelper()

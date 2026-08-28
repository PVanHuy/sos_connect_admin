import { create } from 'zustand'
import type { UserRole } from '../../../utils/status'

export type SessionStatus = 'loading' | 'unauthenticated' | 'authenticated'

export interface SessionUser {
  id: string
  name: string
  phone: string
  role: UserRole
}

interface SessionState {
  status: SessionStatus
  user: SessionUser | null
  accessToken: string | null
  hydrate: () => void
  setAuthenticated: (payload: { user: SessionUser; accessToken: string }) => void
  clear: () => void
}

const SESSION_KEY = 'sos_admin_session'

interface PersistedSession {
  user: SessionUser
  accessToken: string
}

function readPersistedSession(): PersistedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'user' in parsed &&
      'accessToken' in parsed
    ) {
      return parsed as PersistedSession
    }
    return null
  } catch {
    return null
  }
}

export const sessionStore = create<SessionState>((set) => ({
  status: 'loading',
  user: null,
  accessToken: null,
  hydrate: () => {
    const persisted = readPersistedSession()
    if (!persisted) {
      set({ status: 'unauthenticated', user: null, accessToken: null })
      return
    }
    set({
      status: 'authenticated',
      user: persisted.user,
      accessToken: persisted.accessToken,
    })
  },
  setAuthenticated: ({ user, accessToken }) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, accessToken }))
    set({ status: 'authenticated', user, accessToken })
  },
  clear: () => {
    sessionStorage.removeItem(SESSION_KEY)
    set({ status: 'unauthenticated', user: null, accessToken: null })
  },
}))

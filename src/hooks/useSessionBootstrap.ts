import { useEffect } from 'react'
import { sessionStore } from '../features/auth/session/sessionStore'

export function useSessionBootstrap() {
  const hydrate = sessionStore((state) => state.hydrate)
  const status = sessionStore((state) => state.status)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return status
}

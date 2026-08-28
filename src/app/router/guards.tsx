import { Navigate, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../config/routes'
import { sessionStore } from '../../features/auth/session/sessionStore'
import { can, type Permission } from '../../lib/permissions/permission'
import { Spin } from 'antd'

interface GuardProps {
  permission?: Permission
}

export function AuthGuard({ permission }: GuardProps) {
  const status = sessionStore((state) => state.status)
  const user = sessionStore((state) => state.user)

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (status !== 'authenticated' || !user) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  if (permission && !can(user.role, permission)) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}

export function GuestGuard() {
  const status = sessionStore((state) => state.status)

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}

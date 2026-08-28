import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '../config/routes'
import { AdminLayout } from '../layouts/AdminLayout'
import { AuthGuard, GuestGuard } from './guards'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'
import { SosListPage } from '../../features/sos/pages/SosListPage'
import { SosDetailsPage } from '../../features/sos/pages/SosDetailsPage'
import { SosMapPage } from '../../features/sos/map/SosMapPage'
import { UsersPage } from '../../features/users/pages/UsersPage'
import { RescueTeamsPage } from '../../features/rescue-teams/pages/RescueTeamsPage'
import { ApprovalsPage } from '../../features/approvals/pages/ApprovalsPage'
import { PriorityWeightsPage } from '../../features/priority-weights/pages/PriorityWeightsPage'
import { AuditLogsPage } from '../../features/audit-logs/pages/AuditLogsPage'
import { SettingsPage } from '../../features/settings/pages/SettingsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path={APP_ROUTES.app} element={<AdminLayout />}>
          <Route index element={<Navigate to={APP_ROUTES.dashboard} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="sos" element={<SosListPage />} />
          <Route path="sos/:id" element={<SosDetailsPage />} />
          <Route path="sos-map" element={<SosMapPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="rescue-teams" element={<RescueTeamsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="priority-weights" element={<PriorityWeightsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
        <Route path={APP_ROUTES.settings} element={<AdminLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={APP_ROUTES.dashboard} replace />} />
    </Routes>
  )
}

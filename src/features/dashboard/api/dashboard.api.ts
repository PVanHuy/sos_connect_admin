import { mockRequest } from '../../../lib/api/mockRequest'
import { mockDashboardAnalytics } from '../../../lib/api/mocks/adminMocks'
import type { DashboardAnalytics } from '../../../types/domain'

export async function fetchDashboardStats(): Promise<DashboardAnalytics> {
  // TODO: GET apiEndpoints.dashboard.stats
  return mockRequest(mockDashboardAnalytics)
}

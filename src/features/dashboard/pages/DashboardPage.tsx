import { Card, Col, Row, Statistic } from 'antd'
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClusterOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { PageHeader } from '../../../components/shared/PageHeader'
import { QueryState } from '../../../components/shared/QueryState'
import { appColors } from '../../../app/theme/colors'
import { formatNumber } from '../../../utils/format'
import { useDashboardPage } from '../hooks/useDashboardPage'
import { useT } from '../../../app/i18n/useT'
import { DashboardTrendChart } from '../components/DashboardTrendChart'

export function DashboardPage() {
  const { stats, trends, isLoading, isError, errorMessage } = useDashboardPage()
  const t = useT()

  return (
    <>
      <PageHeader
        title={t('page.dashboard.title')}
        description={t('page.dashboard.description')}
      />
      <QueryState isLoading={isLoading} isError={isError} errorMessage={errorMessage} isEmpty={!stats}>
        {stats && trends ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Tổng sự kiện"
                  value={formatNumber(stats.totalEvents)}
                  prefix={<AlertOutlined style={{ color: appColors.appColor }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Đang xử lý"
                  value={formatNumber(stats.activeEvents)}
                  prefix={<AlertOutlined style={{ color: appColors.red26Color }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Người dùng"
                  value={formatNumber(stats.totalUsers)}
                  prefix={<UserOutlined style={{ color: appColors.green47Color }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Đội cứu hộ"
                  value={formatNumber(stats.totalTeams)}
                  prefix={<ClusterOutlined style={{ color: appColors.mintyWaveColor }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Chờ phê duyệt"
                  value={formatNumber(stats.pendingApprovals)}
                  prefix={<TeamOutlined style={{ color: appColors.yellow22Color }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={8}>
              <Card>
                <Statistic
                  title="Hoàn thành hôm nay"
                  value={formatNumber(stats.completedToday)}
                  prefix={<CheckCircleOutlined style={{ color: appColors.blue8FFColor }} />}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card>
                <DashboardTrendChart trends={trends} />
              </Card>
            </Col>
          </Row>
        ) : null}
      </QueryState>
    </>
  )
}

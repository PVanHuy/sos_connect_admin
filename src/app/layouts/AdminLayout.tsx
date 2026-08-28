import {
  AlertOutlined,
  AuditOutlined,
  ClusterOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  SlidersOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { App, Avatar, Button, Layout, Menu, Select, Typography } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import logoApp from '../../assets/images/logo_app/logo_app.png'
import { logoutApi } from '../../features/auth/api/auth.api'
import { sessionStore } from '../../features/auth/session/sessionStore'
import { useUiStore } from '../../stores/uiStore'
import { getUserRoleLabel } from '../../utils/status'
import { APP_ROUTES } from '../config/routes'
import { i18nStore } from '../i18n/i18nStore'
import { useT } from '../i18n/useT'
import { appColors } from '../theme/colors'

const { Header, Sider, Content } = Layout

const SIDER_WIDTH = 248
const SIDER_COLLAPSED_WIDTH = 80

export function AdminLayout() {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = App.useApp()
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const user = sessionStore((state) => state.user)
  const clearSession = sessionStore((state) => state.clear)
  const [loggingOut, setLoggingOut] = useState(false)
  const lang = i18nStore((s) => s.lang)
  const setLang = i18nStore((s) => s.setLang)

  const menuItems: MenuProps['items'] = [
    { key: APP_ROUTES.dashboard, icon: <DashboardOutlined />, label: t('nav.dashboard') },
    { key: APP_ROUTES.sosMap, icon: <EnvironmentOutlined />, label: t('nav.map') },
    { key: APP_ROUTES.sos, icon: <AlertOutlined />, label: t('nav.sosRequests') },
    { key: APP_ROUTES.users, icon: <UserOutlined />, label: t('nav.users') },
    { key: APP_ROUTES.approvals, icon: <TeamOutlined />, label: t('nav.approvals') },
    { key: APP_ROUTES.rescueTeams, icon: <ClusterOutlined />, label: t('nav.rescueTeams') },
    {
      key: APP_ROUTES.priorityWeights,
      icon: <SlidersOutlined />,
      label: t('nav.priorityWeights'),
    },
    { key: APP_ROUTES.auditLogs, icon: <AuditOutlined />, label: t('nav.auditLogs') },
    { key: APP_ROUTES.settings, icon: <SettingOutlined />, label: t('nav.settings') },
  ]

  const selectedKey =
    menuItems
      ?.map((item) => (item && 'key' in item ? String(item.key) : ''))
      .filter((key) => key && location.pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0] ?? APP_ROUTES.dashboard

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logoutApi()
      clearSession()
      navigate(APP_ROUTES.login, { replace: true })
    } catch {
      message.error('Không thể đăng xuất. Vui lòng thử lại.')
    } finally {
      setLoggingOut(false)
    }
  }

  const siderOffset = collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: collapsed ? 12 : 20,
            color: appColors.whiteColor,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {collapsed ? (
              <img
                src={logoApp}
                alt="SOS"
                style={{ width: 38, height: 38, borderRadius: 12, objectFit: 'contain' }}
              />
            ) : (
              <Typography.Title
                level={4}
                style={{ color: appColors.whiteColor, margin: 0, fontSize: 18, lineHeight: 1.2 }}
              >
                SOS
              </Typography.Title>
            )}
            <Button
              type="text"
              aria-label="Toggle sidebar"
              icon={<MenuOutlined style={{ color: appColors.white99Color }} />}
              onClick={toggleSidebar}
              style={{ color: appColors.white99Color }}
            />
          </div>
          {!collapsed ? (
            <Typography.Text style={{ color: appColors.white99Color, lineHeight: 1.2 }}>
              Connect Admin
            </Typography.Text>
          ) : null}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(info) => navigate(info.key)}
        />
      </Sider>
      <Layout
        style={{
          marginInlineStart: siderOffset,
          transition: 'margin-inline-start 0.2s',
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            background: appColors.whiteColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            paddingInline: 24,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Avatar style={{ background: appColors.appColor }}>{user?.name.slice(0, 1)}</Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <div>{user?.name}</div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {user ? getUserRoleLabel(lang, user.role) : ''}
            </Typography.Text>
          </div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            loading={loggingOut}
            onClick={handleLogout}
            aria-label="Đăng xuất"
          >
            {t('common.logout')}
          </Button>
          <Select
            value={lang}
            onChange={(v) => setLang(v === 'en' ? 'en' : 'vi')}
            style={{ width: 92 }}
            options={[
              { value: 'vi', label: 'VI' },
              { value: 'en', label: 'EN' },
            ]}
          />
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

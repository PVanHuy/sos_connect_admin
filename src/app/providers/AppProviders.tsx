import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import viVN from 'antd/locale/vi_VN'
import { antdTheme } from '../theme/antdTheme'
import { useSessionBootstrap } from '../../hooks/useSessionBootstrap'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  useSessionBootstrap()

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={viVN} theme={antdTheme}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

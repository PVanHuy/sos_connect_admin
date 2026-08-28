import { Alert, Empty, Spin } from 'antd'
import type { ReactNode } from 'react'
import { useT } from '../../app/i18n/useT'

interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  isEmpty?: boolean
  emptyDescription?: string
  children: ReactNode
}

export function QueryState({
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  emptyDescription,
  children,
}: QueryStateProps) {
  const t = useT()
  const resolvedEmptyDescription = emptyDescription ?? t('common.noData')

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            color: '#1677ff',
            fontWeight: 500,
          }}
        >
          <Spin size="large" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message={t('common.loadErrorTitle')}
        description={errorMessage ?? t('common.tryAgain')}
      />
    )
  }

  if (isEmpty) {
    return <Empty description={resolvedEmptyDescription} />
  }

  return <>{children}</>
}

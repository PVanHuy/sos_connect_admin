import { zodResolver } from '@hookform/resolvers/zod'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../../app/config/routes'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { loggerHelper } from '../../../lib/logger/loggerHelper'
import { loginApi } from '../api/auth.api'
import { loginFormSchema, type LoginFormValues } from '../schemas/login.schema'
import { sessionStore } from '../session/sessionStore'
import { useT } from '../../../app/i18n/useT'

export function useLoginPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const t = useT()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    loggerHelper.logCyan('[LOGIN PAGE] Submit form', { name: 'LoginPage' })
    loggerHelper.logFullObject({ phone: values.phone, password: '***' }, { name: 'LoginForm' })

    try {
      const result = await loginApi(values)
      sessionStore.getState().setAuthenticated(result)
      loggerHelper.success('[LOGIN PAGE] Session saved', {
        name: 'LoginPage',
        error: {
          userId: result.user.id,
          role: result.user.role,
          tokenPreview: `${result.accessToken.slice(0, 12)}...`,
        },
      })
      message.success(t('login.success'))
      navigate(APP_ROUTES.dashboard, { replace: true })
    } catch (error) {
      const appError = toAppError(error)
      loggerHelper.error('[LOGIN PAGE] Login failed', {
        name: 'LoginPage',
        error: {
          kind: appError.kind,
          message: appError.message,
          status: appError.status,
          raw: error,
        },
      })
      message.error(getUserFacingErrorMessage(appError))
    }
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  }
}

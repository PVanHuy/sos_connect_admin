import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { useT } from '../../../app/i18n/useT'
import { appColors } from '../../../app/theme/colors'
import { appGradients } from '../../../app/theme/gradients'
import { CustomButton } from '../../../components/ui/CustomButton'
import { FormTextField } from '../../../components/ui/FormTextField'
import { formatPasswordInput, formatPhoneInput } from '../../../utils/validation'
import { useLoginPage } from '../hooks/useLoginPage'

export function LoginPage() {
  const { form, isSubmitting, onSubmit } = useLoginPage()
  const t = useT()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        backgroundImage: appGradients.whiteAndBlueF4,
      }}
    >
      <Card style={{ width: 'min(440px, 100%)', borderRadius: 20 }} styles={{ body: { padding: 32 } }}>
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={3} style={{ marginBottom: 4, color: appColors.primaryColor }}>
            {t('login.title')}
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            {t('login.subtitle')}
          </Typography.Paragraph>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormTextField
            control={form.control}
            name="phone"
            label={t('login.phoneLabel')}
            placeholder={t('login.phonePlaceholder')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            prefix={<PhoneOutlined />}
            formatValue={formatPhoneInput}
            maxLength={10}
          />
          <FormTextField
            control={form.control}
            name="password"
            label={t('login.passwordLabel')}
            placeholder={t('login.passwordPlaceholder')}
            type="password"
            autoComplete="current-password"
            prefix={<LockOutlined />}
            formatValue={formatPasswordInput}
            maxLength={50}
          />
          <CustomButton
            htmlType="submit"
            buttonText={t('login.button')}
            isLoading={isSubmitting}
          />
        </form>
      </Card>
    </div>
  )
}

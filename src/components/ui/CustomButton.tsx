import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { appColors } from '../../app/theme/colors'
import { appGradients } from '../../app/theme/gradients'

type CustomButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface CustomButtonProps {
  buttonText: string
  onPressed?: () => void
  htmlType?: ButtonProps['htmlType']
  icon?: ReactNode
  isLoading?: boolean
  disabled?: boolean
  isFullWidth?: boolean
  variant?: CustomButtonVariant
  gradient?: string
  color?: string
  textColor?: string
  radius?: number
  className?: string
}

const variantGradients: Record<Exclude<CustomButtonVariant, 'ghost'>, string> = {
  primary: appGradients.purpleFFAndApp,
  secondary: appGradients.blueAFFAndApp,
  danger: appGradients.red,
}

export function CustomButton({
  buttonText,
  onPressed,
  htmlType = 'button',
  icon,
  isLoading = false,
  disabled = false,
  isFullWidth = true,
  variant = 'primary',
  gradient,
  color,
  textColor,
  radius = 50,
  className,
}: CustomButtonProps) {
  const inactive = disabled || (!isLoading && !onPressed && htmlType !== 'submit')
  const resolvedGradient =
    color || variant === 'ghost' ? undefined : (gradient ?? variantGradients[variant])
  const contentColor = inactive ? appColors.gray86Color : (textColor ?? appColors.whiteColor)

  const style: CSSProperties = {
    width: isFullWidth ? '100%' : undefined,
    borderRadius: radius,
    border: variant === 'ghost' ? `1px solid ${appColors.grayEBColor}` : 0,
    background: inactive
      ? appColors.grayF5Color
      : resolvedGradient
        ? resolvedGradient
        : (color ?? appColors.appColor),
    color: contentColor,
    boxShadow: inactive ? 'none' : '0 8px 18px rgba(0, 123, 243, 0.18)',
    height: 44,
    fontWeight: 600,
  }

  return (
    <Button
      htmlType={htmlType}
      className={[className, isLoading ? 'custom-button--loading' : null].filter(Boolean).join(' ')}
      icon={isLoading ? <LoadingOutlined style={{ color: contentColor }} /> : icon}
      loading={false}
      disabled={isLoading || disabled}
      onClick={onPressed}
      style={style}
    >
      {isLoading ? 'Đang tải...' : buttonText}
    </Button>
  )
}

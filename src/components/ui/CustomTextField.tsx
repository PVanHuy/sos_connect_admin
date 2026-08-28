import { Input } from 'antd'
import type { InputProps, InputRef } from 'antd'
import { forwardRef, type ReactNode } from 'react'
import { appColors } from '../../app/theme/colors'

interface CustomTextFieldProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  type?: 'text' | 'password' | 'email' | 'tel'
  prefix?: ReactNode
  suffix?: ReactNode
  autoComplete?: string
  id?: string
  formatValue?: (value: string) => string
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

export const CustomTextField = forwardRef<InputRef, CustomTextFieldProps>(
  function CustomTextField(
    {
      value,
      onChange,
      onBlur,
      name,
      label,
      placeholder,
      error,
      disabled,
      type = 'text',
      prefix,
      suffix,
      autoComplete,
      id,
      formatValue,
      maxLength,
      inputMode,
    },
    ref,
  ) {
    const inputId = id ?? name

    function handleChange(nextValue: string) {
      const formatted = formatValue ? formatValue(nextValue) : nextValue
      onChange?.(formatted)
    }

    const sharedProps: InputProps = {
      id: inputId,
      name,
      value: value ?? '',
      onBlur,
      disabled,
      prefix,
      suffix,
      placeholder,
      autoComplete,
      status: error ? 'error' : undefined,
      maxLength,
      onChange: (event) => handleChange(event.target.value),
      style: { borderRadius: 12 },
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        {label ? (
          <label htmlFor={inputId} style={{ fontWeight: 600, color: appColors.gray37Color }}>
            {label}
          </label>
        ) : null}
        {type === 'password' ? (
          <Input.Password
            id={sharedProps.id}
            name={sharedProps.name}
            value={sharedProps.value}
            onBlur={sharedProps.onBlur}
            disabled={sharedProps.disabled}
            prefix={sharedProps.prefix}
            suffix={sharedProps.suffix}
            placeholder={sharedProps.placeholder}
            autoComplete={sharedProps.autoComplete}
            status={sharedProps.status}
            maxLength={sharedProps.maxLength}
            onChange={sharedProps.onChange}
            style={sharedProps.style}
            ref={ref}
          />
        ) : (
          <Input {...sharedProps} type={type} inputMode={inputMode} ref={ref} />
        )}
        {error ? (
          <span role="alert" style={{ color: appColors.red26Color, fontSize: 12 }}>
            {error}
          </span>
        ) : null}
      </div>
    )
  },
)

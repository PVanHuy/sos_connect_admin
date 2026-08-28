import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { CustomTextField } from './CustomTextField'
import type { ReactNode } from 'react'

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'tel'
  prefix?: ReactNode
  autoComplete?: string
  disabled?: boolean
  formatValue?: (value: string) => string
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  prefix,
  autoComplete,
  disabled,
  formatValue,
  maxLength,
  inputMode,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <CustomTextField
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          label={label}
          placeholder={placeholder}
          type={type}
          prefix={prefix}
          autoComplete={autoComplete}
          disabled={disabled}
          error={fieldState.error?.message}
          formatValue={formatValue}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      )}
    />
  )
}

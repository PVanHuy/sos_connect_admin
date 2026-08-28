import { loggerHelper } from '../../lib/logger/loggerHelper'
import { validationConstants } from './constants'
import {
  cccdRegex,
  emailRegex,
  passwordRegex,
  personNamePattern,
  validationMessages,
  vnPhoneRegex,
} from './messages'

export interface PhoneValid {
  isValid: boolean
  phone: string
}

function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\s/g, '').replace(/^\+84/, '0').replace(/^0/, '')
}

export function isPhoneValid(number: string): PhoneValid {
  let phone = number

  try {
    const digits = normalizePhoneDigits(number)
    phone = `${validationConstants.defaultPhoneCountryCode}${digits}`
    const isValid = vnPhoneRegex.test(phone)
    return { isValid, phone }
  } catch (error) {
    loggerHelper.error('Phone number validation error', { error, name: 'CustomValidator' })
    return { isValid: false, phone }
  }
}

export function validateName(fullName: string): string {
  if (fullName.trim() === '') {
    return validationMessages.fieldRequired('Tên')
  }
  if (
    fullName.trim().length < validationConstants.minNameLength ||
    fullName.trim().length > validationConstants.maxNameLength
  ) {
    return validationMessages.enterFullField('tên')
  }
  return ''
}

export function validateFullName(fullName: string): string {
  if (fullName.trim() === '') {
    return validationMessages.fieldRequired('Họ và tên')
  }
  if (
    fullName.trim().length < validationConstants.minNameLength ||
    fullName.trim().length > validationConstants.maxNameLength
  ) {
    return validationMessages.enterFullField('họ và tên')
  }
  return ''
}

export function validateCccd(cccd: string, isRequired = true): string {
  if (cccd.trim() === '') {
    return isRequired ? validationMessages.fieldRequired('CCCD') : ''
  }
  if (!cccdRegex.test(cccd.trim())) {
    return validationMessages.fieldInvalid('CCCD')
  }
  return ''
}

export function validateUserName(userName: string): string {
  if (userName.trim() === '') {
    return validationMessages.fieldRequired('Tên đăng nhập')
  }
  if (userName.trim().length < validationConstants.minNameLength) {
    return validationMessages.fieldMinLength('Tên đăng nhập', validationConstants.minNameLength)
  }
  if (userName.trim().length > validationConstants.maxNameLength) {
    return validationMessages.fieldInvalid('Tên đăng nhập')
  }
  return ''
}

export function validatePassword(password: string): string {
  if (password === '') {
    return validationMessages.fieldRequired('Mật khẩu')
  }
  if (!passwordRegex.test(password)) {
    return validationMessages.validatePassword
  }
  return ''
}

export function validateEmail(email: string | undefined | null, isRequired = true): string {
  if (!email || email.trim() === '') {
    return isRequired ? validationMessages.fieldRequired('Email') : ''
  }
  const simpleEmailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
  return simpleEmailRegex.test(email.trim()) ? '' : validationMessages.fieldInvalid('Email')
}

export function validateAddress(address: string): string {
  if (address.trim() === '') {
    return validationMessages.fieldRequired('Địa chỉ')
  }
  if (
    address.trim().length < validationConstants.minAddressLength ||
    address.trim().length > validationConstants.maxAddressLength
  ) {
    return validationMessages.enterFullField('địa chỉ')
  }
  return ''
}

export function validatePhone(phone: string, isRequired = true): string {
  if (isRequired && phone.trim() === '') {
    return validationMessages.fieldRequired('Số điện thoại')
  }

  if (phone.trim() !== '') {
    const phoneValid = isPhoneValid(phone)
    if (!phoneValid.isValid) {
      return validationMessages.fieldInvalid('Số điện thoại')
    }
  }

  return ''
}

export function validateRequiredField(value: string, fieldName: string): string {
  if (value.trim() === '') {
    return validationMessages.fieldRequired(fieldName)
  }
  return ''
}

export function validateRequiredAndMinLength(
  value: string,
  fieldName: string,
  minLength = 3,
): string {
  if (value.trim() === '') {
    return validationMessages.fieldRequired(fieldName)
  }
  if (value.trim().length < minLength) {
    return validationMessages.fieldMinLength(fieldName, minLength)
  }
  return ''
}

export function validateUrlField(url: string, fieldName = 'URL', isRequired = false): string {
  if (url.trim() === '') {
    return isRequired ? validationMessages.fieldRequired(fieldName) : ''
  }

  try {
    const parsed = new URL(url.trim())
    if (!parsed.protocol.startsWith('http')) {
      return validationMessages.fieldInvalid(fieldName)
    }
    if (!parsed.hostname) {
      return validationMessages.fieldInvalid(fieldName)
    }
    return ''
  } catch {
    return validationMessages.fieldInvalid(fieldName)
  }
}

export function isValidPersonName(value: string): boolean {
  const trimmed = value.trim()
  return (
    trimmed.length >= validationConstants.minNameLength &&
    trimmed.length <= validationConstants.maxNameLength &&
    personNamePattern.test(trimmed)
  )
}

export function isValidVnPhone(value: string): boolean {
  return isPhoneValid(value).isValid
}

export function isValidEmail(value: string): boolean {
  return emailRegex.test(value.trim())
}

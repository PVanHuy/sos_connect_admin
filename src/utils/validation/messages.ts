export const validationMessages = {
  fieldRequired: (field: string) => `${field} là bắt buộc.`,
  fieldInvalid: (field: string) => `${field} không hợp lệ.`,
  enterFullField: (field: string) => `Vui lòng nhập đầy đủ ${field}.`,
  fieldMinLength: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự.`,
  validatePassword:
    'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (#?!@$%^&*-).',
  phone: 'Số điện thoại không hợp lệ.',
  email: 'Email không hợp lệ.',
  name: 'Tên chỉ gồm chữ, khoảng trắng và dấu hợp lệ.',
  username: 'Tài khoản từ 3–32 ký tự, chỉ chữ, số, dấu chấm, gạch dưới.',
} as const

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const cccdRegex = /^\d{12}$/

export const passwordRegex =
  /^(?!.*[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯưĂâđêôơư])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])\S{8,}$/

export const vnPhoneRegex = /^\+84[35789]\d{8}$/

export const personNamePattern = /^[\p{L}\s'.-]+$/u

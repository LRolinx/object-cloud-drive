export type VerificationCodeInputProps = {
  maxLength?: number
  placeholder?: string
  value?: string
}

export type VerificationCodeInputEmits = {
  'update:value': (value: string | undefined) => void
}

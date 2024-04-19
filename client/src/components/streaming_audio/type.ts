export type StreamingAudioProps = {
  open?: boolean
  data?: any[]
}

export type StreamingAudioEmits = {
  'update:open': (v: boolean) => void
}

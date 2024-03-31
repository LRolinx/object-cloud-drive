export type StreamingVideoPlayerProps = {
  open?: boolean
  data?: any[]
}

export type StreamingVideoPlayerEmits = {
  'update:open': (v: boolean) => void
}

export type StreamingVideoPlayerProps = {
  open?: boolean
  data?: any[]
  index?: number
}

export type StreamingVideoPlayerEmits = {
  'update:open': (v: boolean) => void
}

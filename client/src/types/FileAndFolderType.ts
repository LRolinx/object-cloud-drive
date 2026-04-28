export type FileAndFloderType = {
  blob: any
  id: string
  name: string
  size: number
  suffix: string
  type: string
  updateTime: string
  fileSha256?: string
  mediaType?: 'video' | 'audio' | string
}

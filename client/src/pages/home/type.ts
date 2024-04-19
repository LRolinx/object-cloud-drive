import { UploadPoolType } from '@/types/UploadPoolType'

export type HomeProps = {
  uploadBufferPool: UploadPoolType[]
  uploadRemainingTask: number
}
export type HomeEmits = {}

/**
 * 上传池类型
 */
export type UploadPoolType = {
  folderId: string
  fileSize: string
  fileType: string
  fname: string
  fext: string
  uploadType: number
  currentChunkMax: number
  uploadCurrentChunkNum: number
}

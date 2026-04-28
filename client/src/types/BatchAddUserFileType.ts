export type BatchAddUserFileType = {
  taskId?: string
  uploadType: number
  uploadCurrentChunkNum: number
  currentChunkMax: number
  file: File
  fileSize: number
  fileType: string
  fname: string
  fext: string
  filePath: string
  fileSha256: string
  folderId: string
  userFileExist: boolean
  fileExist: boolean
  uploadedBytes?: number
  progress?: number
  statusText?: string
  errorMessage?: string
}

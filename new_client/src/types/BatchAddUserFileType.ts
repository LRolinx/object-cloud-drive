export type BatchAddUserFileType = {
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
}

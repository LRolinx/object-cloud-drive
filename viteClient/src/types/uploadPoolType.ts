/**
 * 上传池类型
 */
 interface UploadPoolType {
    folderId: string;
    fileSize: string;
    fileType: string;
    fname: string;
    fext: string;
    
    uploadType: number;
    currentChunkMax: number;
    uploadCurrentChunkNum: number;
  }

export default UploadPoolType
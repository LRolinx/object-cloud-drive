/**
 * <p>
 *  上传接口
 * </p>
 * @author LRolinx
 * @create 2024-03-31 13:26
 */
import $http from '$http'
import { Resp } from '../interface/common'
import { API_LIST } from '../script/api'

// 检查文件
export const examinefileapi = (userUuid: string, folderUuid: string, fileSha256: string, filename: string, fileext: string): Promise<Resp> => {
  return $http.post(API_LIST.UPDATE.EXAMINE_FILE, {
    userUuid,
    folderUuid,
    fileSha256,
    filename,
    fileext,
  })
}

// 片段流上传
export const uploadstreamfileapi = (
  fileslice: any,
  userUuid: string,
  folderUuid: string,
  fileName: string,
  filePath: string,
  fileExt: string,
  fileSha256: string,
  currentChunkMax: number,
  currentChunkIndex: number
): Promise<Resp> => {
  return $http.put(API_LIST.UPDATE.UPLOAD_STREAMFILE, fileslice, {
	params: {
    //   fileslice,
      userUuid,
      folderUuid,
      fileName,
      filePath,
      fileExt,
      fileSha256,
      currentChunkMax,
      currentChunkIndex,
    },
    // headers: {
    //   'Content-Type': 'multipart/form-data;charset=utf-8',
    // },
  })
}

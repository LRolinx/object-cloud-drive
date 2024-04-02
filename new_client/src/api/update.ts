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
export const examinefileapi = (userid: string, folderid: string, sha256Id: string, filename: string, fileext: string): Promise<Resp> => {
  return $http.post(API_LIST.UPDATE.EXAMINE_FILE, {
    userid,
    folderid,
    sha256Id,
    filename,
    fileext,
  })
}

// 片段流上传
export const uploadstreamfileapi = (
  fileslice: any,
  userid: string,
  folderid: string,
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
      userid,
      folderid,
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

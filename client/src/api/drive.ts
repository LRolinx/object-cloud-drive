/**
 * <p>
 *  云盘接口
 * </p>
 * @author LRolinx
 * @create 2024-03-31 13:26
 */
import $http from '$http'
import { AxiosResponse } from 'axios'
import { Resp } from '../interface/common'
import { API_LIST } from '../script/api'
import { BatchAddUserFolderType } from '@/types/BatchAddUserFolderType'

// 获取用户的文件夹与文件
export const getuserfileandfolderapi = (userUuid: string, folderUuid: string): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.GET_USERFILEANDFOLDER, {
    userUuid,
    folderUuid,
  })
}

//添加用户文件夹
export const adduserfolderapi = (userUuid: string, folderUuid: string, name: string): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.ADD_USERFOLDER, {
    userUuid,
    folderUuid,
    name,
  })
}

//批量添加用户文件夹
export const batchAddUserFolderApi = (userUuid: string, data: BatchAddUserFolderType[]): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.BATCHADD_USERFOLDER, {
    userUuid,
    data
  })
}

//通过文件id获取用户文件
export const getuserfileforfileidapi = (id: string): Promise<Resp> => {
  return $http.post(
    API_LIST.DRIVE.GET_USERFILEFORFILEID,
    {
      id,
    },
    {
      responseType: 'blob',
    }
  )
}

//删除文件或文件夹
export const deluserfileorfolderapi = (id: string, type: string): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.DEL_USERFILEORFOLDER, {
    id,
    type,
  })
}

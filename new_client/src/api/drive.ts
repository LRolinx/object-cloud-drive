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

// 获取用户的文件夹与文件
export const getuserfileandfolderapi = (userid: string, folderid: string): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.GET_USERFILEANDFOLDER, {
    userid,
    folderid,
  })
}

//添加用户文件夹
export const adduserfolderapi = (userid: string, folderid: string, name: string): Promise<Resp> => {
  return $http.post(API_LIST.DRIVE.ADD_USERFOLDER, {
    userid,
    folderid,
    name,
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
  return $http.post(
    API_LIST.DRIVE.DEL_USERFILEORFOLDER,
    {
      id,
      type,
    },
  )
}

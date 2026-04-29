/**
 * <p>
 *  资源池接口
 * </p>
 * @author LRolinx
 * @create 2024-04-11 13:26
 */
import $http from '$http'
import { AxiosResponse } from 'axios'
import { Resp } from '../interface/common'
import { API_LIST } from '../script/api'

//播放视频流
export const playvideosteamapi = (path: string): Promise<AxiosResponse<Blob>> => {
  return $http.post(
    API_LIST.RESOURCEPOOL.PLAY_VIDEOSTEAM,
    {
      path,
    },
    {
      responseType: 'blob',
    }
  )
}

export const getResourcePoolVideoStreamUrl = (path: string) =>
  `${API_LIST.BASEURL}${API_LIST.RESOURCEPOOL.PLAY_VIDEOSTEAM}?path=${encodeURIComponent(path)}`

export const getResourcePoolAudioStreamUrl = (path: string) =>
  `${API_LIST.BASEURL}${API_LIST.RESOURCEPOOL.PLAY_AUDIOSTREAM}?path=${encodeURIComponent(path)}`

//获取视频缩略图
export const getvideosceenshotsapi = (name: string, ext: string, path: string): Promise<AxiosResponse> => {
  return $http.post(
    API_LIST.RESOURCEPOOL.GET_VIDEOSCEENSHOTS,
    {
      name,
	  ext,
	  path
    },
    {
      responseType: 'blob',
    }
  )
}

export type ResourcePoolFolderPage<T = any> = {
  items: T[]
  page: number
  pageSize: number
  hasMore: boolean
}

//获取目录下的文件夹和文件
export const getfolderandfileapi = (
  path?: string,
  page = 1,
  pageSize = 60
): Promise<AxiosResponse<Resp<ResourcePoolFolderPage>>> => {
  return $http.post(
    API_LIST.RESOURCEPOOL.GET_FOLDERANDFILE,
    {
      path,
      page,
      pageSize,
    }
    //   {
    // 	responseType: 'blob',
    //   }
  )
}

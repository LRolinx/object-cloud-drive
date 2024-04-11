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
export const playvideosteamapi = (id: string): Promise<Resp> => {
  return $http.post(
    API_LIST.RESOURCEPOOL.PLAY_VIDEOSTEAM,
    {
      id,
    },
    {
      responseType: 'blob',
    }
  )
}

//获取视频缩略图
export const getvideosceenshotsapi = (id: string): Promise<AxiosResponse> => {
  return $http.post(
    API_LIST.RESOURCEPOOL.GET_VIDEOSCEENSHOTS,
    {
      id,
    },
    {
      responseType: 'blob',
    }
  )
}

//获取目录下的文件夹和文件
export const getfolderandfileapi = (path?: string): Promise<AxiosResponse> => {
	return $http.post(
	  API_LIST.RESOURCEPOOL.GET_FOLDERANDFILE,
	  {
		path,
	  },
	//   {
	// 	responseType: 'blob',
	//   }
	)
  }

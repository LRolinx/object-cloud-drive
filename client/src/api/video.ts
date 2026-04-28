/**
 * <p>
 *  视频接口
 * </p>
 * @author LRolinx
 * @create 2024-03-31 13:26
 */
import $http from '$http'
import { AxiosResponse } from 'axios'
import { Resp } from '../interface/common'
import { API_LIST } from '../script/api'

//获取视频预览图
export const getvideosceenshotsapi = (fileSha256: string): Promise<Resp> => {
  return $http.post(
    API_LIST.VIDEO.GET_VIDEOSCEENSHOTS,
    {
      fileSha256,
    },
    {
      responseType: 'blob',
    }
  )
}

//获取视频预览图
export const playvideosteamapi = (id: string): Promise<AxiosResponse> => {
  return $http.post(
    API_LIST.VIDEO.PLAY_VIDEOSTEAM,
    {
      id,
    },
    {
      responseType: 'blob',
    }
  )
}

export const getVideoStreamUrl = (id: string) =>
  `${API_LIST.BASEURL}${API_LIST.VIDEO.PLAY_VIDEOSTEAM}?id=${encodeURIComponent(id)}`

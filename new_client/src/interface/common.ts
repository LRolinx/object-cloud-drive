import { AxiosResponse } from 'axios'

/**
 * <p>
 * 响应结构
 * </p>
 *
 * @version: v1.0
 * @author: Clover You
 * @email: cloveryou02@163.com
 * @create: 2022-07-06 17:13
 **/
export interface Resp<T = any> {
  /**
   * 状态码
   */
  code: number
  /**
   * 响应消息
   */
  message: string
  /**
   * 响应数据
   */
  data: T
  /**
   * 响应时间
   */
  timestamp: number
  /**
   * 耗时
   */
  executeTime: number
}

/**
 * 分页结构体
 */
export interface Page<T> {
  /**
   * 总条数
   */
  total: number

  /**
   * 分页数据
   */
  list: T
}

/**
 * 分页响应结构体
 */
export type PageResp<T> = {} & Resp<Page<T>>

export type AxiosResp<T = any> = Promise<AxiosResponse<Resp<T>>>

export type AxiosPageResp<T = any> = Promise<AxiosResponse<PageResp<T>>>

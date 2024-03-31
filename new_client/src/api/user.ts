/**
 * <p>
 *  用户接口
 * </p>
 * @author LRolinx
 * @create 2024-03-30 13:26
 */
import $http from '$http'
import { AxiosResponse } from 'axios'
import { Resp } from '../interface/common'
import { API_LIST } from '../script/api'

// 获取公钥
export const getpublickeyapi = (): Promise<AxiosResponse> => {
  return $http.post(API_LIST.USER.GET_PUBLICKEY)
}

/**
 * 登录
 * @param userCode 用户代码
 * @param password 用户密码
 */
export const loginapi = (account: string, password: string): Promise<Resp> => {
  return $http.post(API_LIST.USER.LOGIN, { account, password })
}

/**
 * 注册
 * @param nickName 昵称
 * @param account 账号
 * @param password 密码
 * @param registeredCode 用户密码
 */
export const registeredapi = (nickName, account: string, password: string, registeredCode: string): Promise<Resp> => {
  return $http.post(API_LIST.USER.REGISTERED, { nickName, account, password, registeredCode })
}

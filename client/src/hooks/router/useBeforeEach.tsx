/**
 * <p>
 * 路由前置守卫
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 12:11
 */

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const useBeforeEach = (callback: Function) => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    callback()
  }, [location])
}

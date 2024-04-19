/**
 * <p>
 * 路由配置
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 12:03
 */

import { LoginPage } from "@/pages/login";
import { RouteObject, useRoutes } from "react-router-dom";

const ROUTE_MAP: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage/>
  }
]

export const ReactRoutes = () => useRoutes(ROUTE_MAP)

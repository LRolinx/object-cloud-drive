/*
 * @Author: LRolinx
 * @Date: 2020-11-20 09:36:28
 * @LastEditTime: 2022-03-16 19:22:11
 * @Description: app路由
 *
 */
import { RouteRecordRaw, createRouter, createWebHistory, useRoute } from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory

// 引入组件
import loginAndRegistered from '@/pages/login_and_registered/index' //登录与注册
import home from '@/pages/home/' //主页
import drive from '@/pages/drive/' //云盘
import driveResourcePool from '@/pages/drive_resource_pool/index.vue' //资源池
import iconList from '@/pages/icon_list/index.vue' //图标库
import streamingVideo from '@/pages/streaming_video/index.vue' //视频流DEMO
import interactiveEffect from '@/pages/interactive_effect/index.vue' //交互效果DEMO
import error404 from '@/pages/error/404.vue' //404错误
import { useUserStore } from '@/store/models/user'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/store/models/app'

const routes = [
  {
    path: '/login',
    component: loginAndRegistered,
    name: 'login',
    meta: {
      title: '登录对象云盘',
    },
  },
  {
    path: '/home',
    component: home,
    name: 'home',
    meta: {
      title: '对象云盘',
    },
    children: [
      {
        path: '/home/drive/:folderId(.*)*',
        component: drive,
        name: 'drive',
        meta: {
          title: '对象云盘',
        },
      },
      {
        path: '/home/driveResourcePool',
        component: driveResourcePool,
        name: 'driveResourcePool',
        meta: {
          title: '对象云盘-资源池',
        },
      },
      {
        path: '/home/iconList',
        component: iconList,
        name: 'iconList',
        meta: {
          title: '对象云盘-图标库',
        },
      },
      {
        path: '/home/streamingVideo',
        component: streamingVideo,
        name: 'streamingVideo',
        meta: {
          title: '对象云盘-视频流DEMO',
        },
      },
      {
        path: '/home/interactiveEffect',
        component: interactiveEffect,
        name: 'interactiveEffect',
        meta: {
          title: '对象云盘-交互效果DEMO',
        },
      },
    ],
  },
  {
    path: '/404',
    component: error404,
    name: '404',
  },
  //   {
  //     // 重定向到登录
  //     path: '/',
  //     redirect: '/login',
  //   },
  //   {
  //     // 没这个路径
  //     path: '/:pathMatch(.*)*',
  //     redirect: '/404', //重定向到404
  //   },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// var router = new VueRouter({
//     mode: 'history', //去掉url中的#
//     routes
// })

const NotFoundRouter: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
}

/**
 * 首次加载
 */
const firstHandle = async () => {
  //   const permissionStore = usePermissionStore()

  //   const routes = await permissionStore.setSiderbarRouters()
  //   addRoutes(routes ?? [])
  router.addRoute(NotFoundRouter)
}

router.beforeEach(async (to, _from, next) => {
  /* 路由发生变化修改页面title */
  const userStore = useUserStore()
  const appStore = useAppStore()
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  if (to.path !== '/login' && to.path !== '/404') {
    if (!userStore.isLogin) {
      return next('/login?callback=' + to.path)
    } else {
      // 是否首次加载，载入路由
      if (!appStore.initState) {
        const cancelLoad = message.loading({ content: '正在载入路由...', duration: 60 })
        await firstHandle()

        setTimeout(() => {
          appStore.initState = true
          cancelLoad()
        }, 1000)
        appStore.initState = true
        return next({ ...to })
      }
    }
  } else if (userStore.isLogin && to.path == '/login') {
    return next('/home')
  }

  next()
})
export default router
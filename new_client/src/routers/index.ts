/*
 * @Author: LRolinx
 * @Date: 2020-11-20 09:36:28
 * @LastEditTime: 2022-03-16 19:22:11
 * @Description: app路由
 *
 */
import { createRouter, createWebHistory } from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory

// 引入组件
import loginAndRegistered from '@/pages/login_and_registered/index' //登录与注册
import home from '@/pages/home/' //主页
import drive from '@/pages/drive/' //云盘
import driveResourcePool from '@/pages/drive_resource_pool/index.vue' //资源池
import { StreamingVideo } from '@/pages/streaming_video' //视频流DEMO
import error404 from '@/pages/error/404' //404错误
import { useUserStore } from '@/store/models/user'

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
        path: 'drive/:folderId(.*)*',
        component: drive,
        name: 'drive',
        meta: {
          title: '对象云盘',
        },
      },
      {
        path: 'driveResourcePool',
        component: driveResourcePool,
        name: 'driveResourcePool',
        meta: {
          title: '对象云盘-资源池',
        },
      },
      {
        path: 'StreamingVideo',
        component: StreamingVideo,
        name: 'StreamingVideo',
        meta: {
          title: '对象云盘-视频流DEMO',
        },
      },
    ],
  },
  {
    path: '/404',
    component: error404,
    name: '404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach(async (to, _from) => {
  /* 路由发生变化修改页面title */
  const userStore = useUserStore()
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

//   console.log(userStore.isLogin, to.name, to.path)

  if (!userStore.isLogin && to.name !== 'login') {
    //用户未登录 重定向到登录页面，并且避免无限重定向
    return { name: 'login' }
  }

  if (userStore.isLogin && (to.path === '/' || to.name === 'home' || to.name === 'login')) {
    //用户已登录 去到根页面或home或login跳到drive
    return { name: 'drive' }
  }

  if (userStore.isLogin && to.name === undefined) {
    //用户已登录 去到不存在的页面
    return { name: '404' }
  }

})
export default router

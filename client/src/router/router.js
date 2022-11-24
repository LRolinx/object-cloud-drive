/*
 * @Author: LRolinx
 * @Date: 2020-11-20 09:36:28
 * @LastEditTime: 2022-03-16 19:22:11
 * @Description: app路由
 * 
 */
// import Vue from "vue";

import { createRouter, createWebHistory } from "vue-router";
// 还有 createWebHashHistory 和 createMemoryHistory


// 引入组件
import loginAndRegistered from "../pages/loginAndRegistered.vue"; //登录与注册

import home from "../pages/home.vue"; //主页
import drive from "../pages/drive.vue"; //云盘
import driveResourcePool from "../pages/driveResourcePool.vue"; //资源池
import iconList from "../pages/iconList.vue"; //图标库
import streamingVideo from "../pages/streamingVideo.vue"; //视频流DEMO
import interactiveEffect from "../pages/interactiveEffect.vue"; //交互效果DEMO
import error404 from "../pages/error404.vue"; //404错误
import error500 from "../pages/error500.vue"; //500错误

// 使用 vueRouter
// Vue.use(VueRouter);

const routes = [{
    path: "/login",
    component: loginAndRegistered,
    name: "login",
    meta: {
        title: '登录对象云盘'
    }
},
{
    path: "/home",
    component: home,
    name: "home",
    meta: {
        title: '对象云盘'
    },
    children: [{
        path: "/home/drive/:folderId(.*)*",
        component: drive,
        name: "drive",
        meta: {
            title: '对象云盘'
        }
    },
    {
        path: "/home/driveResourcePool",
        component: driveResourcePool,
        name: "driveResourcePool",
        meta: {
            title: '对象云盘-资源池'
        }
    },
    {
        path: "/home/iconList",
        component: iconList,
        name: "iconList",
        meta: {
            title: '对象云盘-图标库'
        }
    },
    {
        path: "/home/streamingVideo",
        component: streamingVideo,
        name: "streamingVideo",
        meta: {
            title: '对象云盘-视频流DEMO'
        }
    },
    {
        path: "/home/interactiveEffect",
        component: interactiveEffect,
        name: "interactiveEffect",
        meta: {
            title: '对象云盘-交互效果DEMO'
        }
    },
    ],
},
{
    path: "/error404",
    component: error404,
    name: "error404",
},
{
    path: "/error500",
    component: error500,
    name: "error500",
},
{
    // 重定向到登录
    path: '/',
    redirect: '/login'
},
{
    // 没这个路径
    path: '/:pathMatch(.*)*',
    redirect: '/error404' //重定向到404
},
    // {
    //   path: "/blog",
    //   component: blog,
    //   name: "blog",
    //   meta: {
    //     keepAlive: true, //该字段表示该页面需要缓存
    //     isBack: false, //用于判断上一个页面是哪个
    //     title: '博客首页'
    //   },
    // },
    // {
    //   path: "/blogDetails/:moreId",
    //   component: blogDetails,
    //   name: "blogDetails",
    //   meta: {
    //     keepAlive: false, //该字段表示该页面不需要缓存
    //     isBack: false, //用于判断上一个页面是哪个
    //     title: '博客详情'
    //   },
    // },

    // {
    //   //空博客详情id重定向到博客首页
    //   path: '/p/',
    //   redirect: '/blog'
    // },
    // {
    //   //重定向到博客详情页
    //   path: ('/p/:moreId'),
    //   redirect: '/blogDetails/:moreId'
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// var router = new VueRouter({
//     mode: 'history', //去掉url中的#
//     routes
// })

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
})
export default router;
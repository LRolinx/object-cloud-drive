import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // other options...
  persist: {
    //   enabled: true, // 开启缓存  默认会存储在本地localstorage
    storage: sessionStorage, // 缓存使用方式
    //   paths: ['info', 'isLogin', 'id', 'photo', 'nickname', 'siderbarStr', 'serve', 'drive'], // 需要缓存键
  },
  state: () => {
    return {
      isLogin: false, //是否登录
      id: '', //用户id
      photo: '', //用户头像
      nickname: '', //用户昵称
    }
  },
  actions: {},
})

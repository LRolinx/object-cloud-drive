import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', {
  // other options...
  persist: {
    storage: sessionStorage, // 缓存使用方式
  },
  state: () => {
    return {
      initState: false, //初始化状态
      width: 0, //浏览器宽度
      height: 0, //浏览器高度
      publickey: '', //公钥
      siderbarStr: 'drive', //当前页面名
      counter: ref(0), //操作计数器
    }
  },
  actions: {},
})

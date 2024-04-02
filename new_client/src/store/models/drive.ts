import { defineStore } from 'pinia'

export const useDriveStore = defineStore('drive', {
  // other options...
  persist: {
    storage: sessionStorage, // 缓存使用方式
  },
  state: () => {
    return {
      navigation: [], //导航
      currenFolderId: '0', //当前文件夹id
      uploadTaskList: [], //上传任务列表
      uploadTaskSuccessList: [], //上传任务完成列表
      uploadSetTimeOut: null, //延迟倒计时
      uploadRemainingTask: 0, //剩余上传任务
    }
  },
  actions: {},
})

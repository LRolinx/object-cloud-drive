// 全局数据

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalDataStore = defineStore('globalData', () => {
  const fileMenuPos = ref({ x: 0, y: 0 })
  const isShowRightMenu = ref(false)
  const showRightMenuType = ref(undefined)
  const rightMenuItem = ref(undefined)

  // 文件数据
  const fileData = ref()

  //显示拖拽上传范围显示
  const isShowUpdateModel = ref(false)

  //显示新建文件夹模态窗
  const showNewFolderModel = ref(false)

  return {
    fileMenuPos,
	isShowRightMenu,
	showRightMenuType,
	rightMenuItem,
	isShowUpdateModel,
	showNewFolderModel,
	fileData
  }
})

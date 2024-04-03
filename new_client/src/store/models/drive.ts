import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDriveStore = defineStore(
  'drive',
  () => {
    const navigation = ref([]) //导航
    const currenFolderId = ref('0') //当前文件夹id
    const uploadTaskList = ref([]) //上传任务列表
	const counter = ref(0)

    return {
      navigation,
      currenFolderId,
      uploadTaskList,
	  counter
    }
  },
//   {
//     persist: {
//       storage: sessionStorage, // 缓存使用方式
//     },
//   }
)

// {
//   // other options...
//   persist: {
//     storage: sessionStorage, // 缓存使用方式
//   },
//   state: () => {
//     return {

//     }
//   },
//   actions: {},
// })

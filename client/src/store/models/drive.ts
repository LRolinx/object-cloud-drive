import { BatchAddUserFileType } from '@/types/BatchAddUserFileType'
import { NavigationType } from '@/types/NavigationType'
import MathTools from '@/utils/MathTools'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDriveStore = defineStore(
  'drive',
  () => {
    const navigation = ref<NavigationType[]>([]) //导航
    const currenFolderId = ref(MathTools.RootUUID()) //当前文件夹id
    const uploadTaskList = ref<BatchAddUserFileType[]>([]) //上传任务列表

    return {
      navigation,
      currenFolderId,
      uploadTaskList,
    }
  }
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

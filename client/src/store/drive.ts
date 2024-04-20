import {createSlice} from "@reduxjs/toolkit";
import {NavigationType} from "react-router-dom";
import MathTools from "@/utils/MathTools";
import {BatchAddUserFileType} from "@/types/BatchAddUserFileType";

export const useDriveStore = createSlice(
    {
        name:'drive',
        initialState:{
              navigation : <NavigationType[]>([]), //导航
              currenFolderId : MathTools.RootUUID(), //当前文件夹id
              uploadTaskList : <BatchAddUserFileType[]>([]), //上传任务列表
        },
        reducers:{

        }

  // () => {
  //   const navigation = ref<NavigationType[]>([]) //导航
  //   const currenFolderId = ref(MathTools.RootUUID()) //当前文件夹id
  //   const uploadTaskList = ref<BatchAddUserFileType[]>([]) //上传任务列表
  //
  //   return {
  //     navigation,
  //     currenFolderId,
  //     uploadTaskList,
  //   }
  // }
  //   {
  //     persist: {
  //       storage: sessionStorage, // 缓存使用方式
  //     },
  //   }


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
})

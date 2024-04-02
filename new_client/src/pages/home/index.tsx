import { defineComponent, onMounted, ref, watch } from 'vue'
import './index.less'
import { useUserStore } from '@/store/models/user'
import { HomeEmits, HomeProps } from './type'
import { UploadModal } from '@/components/upload_modal'
import { useRoute, useRouter } from 'vue-router'
import { sha256 } from 'js-sha256'
import { examinefileapi, uploadstreamfileapi } from '@/api/update'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/store/models/app'
import { useDriveStore } from '@/store/models/drive'
import { PlaySquareTwoTone, CloudTwoTone, DatabaseTwoTone, StarTwoTone } from '@ant-design/icons-vue'
import { NewFolder } from './components/new_folder'
import { adduserfolderapi } from '@/api/drive'

export default defineComponent<HomeProps, HomeEmits>(
  (props, ctx) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const driveStore = useDriveStore()
    const route = useRoute()
    const router = useRouter()

    const showNewFolderModel = ref(false)

    const childRouter = ref()

    //打开新建文件夹
    const onOpenNewFolderModel = () => {
      console.log(childRouter.value)
	  childRouter.value.openNewFolderModel()
    //   childRouter.value.$props.openNewFolderModel()
    //   childRouter.value.openNewFolderModel()
    }

    /**
     * 添加用户文件夹
     * @param value
     */
    // const newFolderSubmit = (value: string) => {
    // 	showNewFolderModel.value = false
    // 	adduserfolderapi(userStore.id, getFolderId(), value).then((resp) => {
    // 	  const { code, message: msg } = resp.data
    // 	  if (code !== 200) {
    // 		return message.error(msg)
    // 	  }
    // 	  getUserFileAndFolder(getFolderId())
    // 	})
    //   }

    //分配任务
    const distributionTask = () => {
      for (let i = 0, len = driveStore.uploadBufferPool.length; i < len; i++) {
        if (driveStore.uploadBufferPool[i].uploadType == 0) {
          //有空闲线程先异步执行
          setTaskState(driveStore.uploadBufferPool[i], 0, 1)
          upLoadFun(driveStore.uploadBufferPool[i])
        }
      }
    }

    const openDrive = () => {
      //打开我的云盘
      router.push({ name: 'drive' })
    }

    const openDriveResourcePool = () => {
      // 打开资源池
      router.push({ name: 'driveResourcePool' })
    }

    const openStreamingVideo = () => {
      //打开视频流DEMO
      router.push({ name: 'StreamingVideo' })
    }

    const setTaskState = (item, stateCode, ano) => {
      //设置任务状态
      //0等待中 1准备中 2上传中 3上传暂停 4上传完成 5秒传 6文件太小 7文件太大 8文件已存在 404上传错误
      item.uploadType = stateCode

      if (ano == 0) {
        --driveStore.uploadRemainingTask
      } else if (ano == 1) {
        ++driveStore.uploadRemainingTask
      }
    }

    const upLoadFun = (item) => {
      if (item.file.size <= 0) {
        //文件太小,无法上传
        setTaskState(item, 6, 0)
        return
      }
      setTaskState(item, 1, 3)
      //拿到sha256
      const fr = new FileReader()
      fr.readAsArrayBuffer(item.file)
      fr.onload = (data) => {
        const sha256Id = sha256(data.target.result)
        item.fileSha256 = sha256Id

        examinefileapi(userStore.id, item.folderId, sha256Id, item.fname, item.fext).then((resp) => {
          const { code, message: msg, data } = resp.data
          if (code !== 200) {
            //上传失败
            setTaskState(item, 404, 0)
            console.log(msg)
            return message.error(msg)
          }
          const blobSlice = File.prototype.slice

          // 指定文件分块大小 1024的2次方
          const chunkSize = calculateSliceSize(item.file.size) * 1024 ** 2
          // 计算文件分块总数
          const chunks = Math.ceil(item.file.size / chunkSize)
          //设置总片段数量
          item.currentChunkMax = chunks

          if (!data.userFileExist) {
            if (!data.fileExist) {
              //设置该任务的状态
              setTaskState(item, 2, 3)
              for (let i = 0, len = chunks; i < len; i++) {
                // 计算开始读取的位置
                const start = i * chunkSize
                // 计算结束读取的位置
                const end = start + chunkSize >= item.file.size ? item.file.size : start + chunkSize

                // 简化流程
                const fileslice = blobSlice.call(item.file, start, end)

                //片段流上传

                uploadstreamfileapi(fileslice, userStore.id, item.folderId, item.fname, item.filePath, item.fext, item.fileSha256, chunks, i).then((resp2) => {
                  const { code: code2, message: msg2, data: data2 } = resp2.data
                  if (code !== 200) {
                    //上传失败
                    setTaskState(item, 404, 0)
                    console.log('上传出错')
                    return message.error(msg2)
                  }

                  item.uploadCurrentChunkNum = item.uploadCurrentChunkNum + 1
                  if (item.uploadCurrentChunkNum >= item.currentChunkMax) {
                    // console.log(childRouter);
                    // $refs.childRouter.getUserFileAndFolder(
                    //   $refs.childRouter.getFolderId()
                    // );

                    //设置任务上传完成
                    setTaskState(item, 4, 0)
                  }
                })
              }
            } else {
              //秒传文件
              //   $http
              //     .post(`${userStore.serve.serveUrl}upload/uploadSecondPass`, {
              //       userid: userStore.id,
              //       folderid: item.folderId,
              //       fileName: item.fname,
              //       filePath: item.filePath,
              //       fileExt: item.fext,
              //       fileSha256: item.fileSha256,
              //     })
              //     .then((SecondPass) => {
              //       if (SecondPass.data.code == 200) {
              //         // childRouter.value.getUserFileAndFolder(
              //         //   childRouter.value.getFolderId()
              //         // );
              //         // console.log(childRouter);
              //         //设置任务为秒传
              //         setTaskState(item, 5, 0)
              //       } else {
              //         //秒传失败
              //         setTaskState(item, 404, 0)
              //         console.log(SecondPass.data.message)
              //       }
              //     })
            }
          } else {
            //文件已存在
            setTaskState(item, 8, 0)
          }
        })
      }
    }

    const calculateSliceSize = (size: number) => {
      //计算分段
      let Msize = Number((((size / 1024 ** 2) * 100) / 100).toFixed(2))
      if (Msize < 10) {
        return 10
      } else if (Msize < 100) {
        return 10
      } else {
        return 10
      }
    }

    //初始化
    onMounted(() => {})

    watch(route, (toRouter) => {
      // //设置最后路由
      appStore.siderbarStr = toRouter.name.toString()
      // sessionStorage.setItem("siderbarStr", toRouter.name);
      appStore.siderbarStr = toRouter.name.toString() //重置最后路由
    })

    userStore.$subscribe((m, s) => {
      //监听文件变化
      // uploadBufferPool = s.drive.uploadBufferPool;
      distributionTask()
      // console.log(s);
    })

    return () => {
      return (
        <>
          <div class="home">
            {/* <NewFolder v-model:open={showNewFolderModel.value} onSubmit={newFolderSubmit}></NewFolder> */}

            <div class="topbar" v-if="false">
              <p>网盘2.0 全新升级~</p>
            </div>

            <div class="main">
              <div class="siderbar">
                <div class="logo">
                  <p>对象云盘</p>
                </div>

                <ul class="siderbarUl">
                  <li class={{ liOn: appStore.siderbarStr == 'drive' }} onClick={openDrive}>
                    {/* <i class="iconfont icon-drive"></i> */}
                    <CloudTwoTone />
                    <p>我的云盘</p>
                  </li>
                  <li class={{ liOn: appStore.siderbarStr == 'driveResourcePool' }} onClick={openDriveResourcePool}>
                    {/* <i class="iconfont icon-cloud"></i> */}
                    <DatabaseTwoTone />
                    <p>资源池</p>
                  </li>
                  <li class={{ liOn: appStore.siderbarStr == 'StreamingVideo' }} onClick={openStreamingVideo}>
                    {/* <i class="iconfont icon-video-play"></i> */}
                    <PlaySquareTwoTone />
                    <p>视频流DEMO</p>
                  </li>
                </ul>

                <div class="headBox">
                  <div class="headChildBox">
                    <img src={userStore.photo} />
                    <p>{userStore.nickname}</p>
                  </div>
                </div>
              </div>
              <div class="content">
                <router-view ref={childRouter}></router-view>
              </div>
            </div>
            <UploadModal onOpenNewFolderModel={onOpenNewFolderModel} uploadBufferPool={props.uploadBufferPool} uploadRemainingTask={props.uploadRemainingTask}></UploadModal>
          </div>
        </>
      )
    }
  },
  {
    name: '_home',
    props: [],
    emits: [],
  }
)

import { defineComponent, onMounted, ref, watch } from 'vue'
import './index.less'
import { useUserStore } from '@/store/models/user'
import { HomeEmits, HomeProps } from './type'
import { useRoute, useRouter } from 'vue-router'
import { sha256 } from 'js-sha256'
import { examinefileapi, uploadstreamfileapi } from '@/api/update'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/store/models/app'
import { useDriveStore } from '@/store/models/drive'
import { PlaySquareTwoTone, CloudTwoTone, DatabaseTwoTone } from '@ant-design/icons-vue'
import { UploadFloatButtonGroup } from './components/upload_floatbuttongroup'
import { UploadType } from '@/types/UploadType'

export default defineComponent<HomeProps, HomeEmits>(
  (props, ctx) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const driveStore = useDriveStore()
    const route = useRoute()
    const router = useRouter()

    const childRouter = ref()

    //打开新建文件夹
    const onOpenNewFolderModel = () => {
      console.log(childRouter.value)
      //   childRouter.value.openNewFolderModel()
      //   childRouter.value.$props.openNewFolderModel()
      //   childRouter.value.openNewFolderModel()
    }

    //分配任务
    const distributionTask = () => {
      console.log('分配人物')
      for (let i = 0, len = driveStore.uploadTaskList.length; i < len; i++) {
        if (driveStore.uploadTaskList[i].uploadType == 0) {
          //有空闲线程先异步执行
          upLoadFun(driveStore.uploadTaskList[i])
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

    // 片段上传
    const upLoadFun = (item) => {
      const blobSlice = File.prototype.slice

      // 指定文件分块大小 1024的2次方
      const chunkSize = calculateSliceSize(item.file.size) * 1024 ** 2
      // 计算文件分块总数
      const chunks = Math.ceil(item.file.size / chunkSize)
      //设置总片段数量
      item.currentChunkMax = chunks

      //设置状态为上传中
      setUploadType(item, UploadType.Conduct)

      for (let i = 0, len = chunks; i < len; i++) {
        // 计算开始读取的位置
        const start = i * chunkSize
        // 计算结束读取的位置
        const end = start + chunkSize >= item.file.size ? item.file.size : start + chunkSize

        // 简化流程
        const fileslice = blobSlice.call(item.file, start, end)

        //片段流上传
        const params = new FormData() //创建form对象
        params.append('file', fileslice)

        uploadstreamfileapi(params, userStore.id, item.folderId, item.fname, item.filePath, item.fext, item.fileSha256, chunks, i).then((resp) => {
          console.log(resp)
          const { code: code, message: msg, data: data } = resp.data
          if (code !== 200) {
            //上传失败
            setUploadType(item, UploadType.Error)
            return message.error(msg)
          }

          item.uploadCurrentChunkNum = item.uploadCurrentChunkNum + 1
          if (item.uploadCurrentChunkNum >= item.currentChunkMax) {
            // console.log(childRouter);
            // $refs.childRouter.getUserFileAndFolder(
            //   $refs.childRouter.getFolderId()
            // );

            //设置任务上传完成
            setUploadType(item, UploadType.Success)
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

    //设置上传状态
    const setUploadType = (item: any, type: UploadType) => {
      item['uploadType'] = type
    }

    watch(route, (toRouter) => {
      // //设置最后路由
      appStore.siderbarStr = toRouter.name.toString()
      // sessionStorage.setItem("siderbarStr", toRouter.name);
      appStore.siderbarStr = toRouter.name.toString() //重置最后路由
    })

    // watch(
    //   () => driveStore.uploadTaskList,
    //   () => {
    //     //监听文件上传任务 进行分配上传
    //     distributionTask()
    //   },
    //   { deep: true }
    // )

    driveStore.$subscribe((m, s) => {
      //监听任务列表变化
      //   console.log(m.events['type'])
      if (m.events['type'] === 'add') {
        // 监听到添加任务 开始分配任务
        const item = m.events['newValue']
        if (typeof item != 'object') return
        //检查文件是否过小或过大或者文件是否存在
        if (item['file']['size'] <= 0) {
          //文件太小,无法上传
          setUploadType(item, UploadType.Small)
          return
        }
        if (item['file']['size'] >= 1024 * 1024 * 1024 * 10) {
          //文件太大,无法上传
          setUploadType(item, UploadType.Big)
          return
        }

        const fr = new FileReader()
        fr.readAsArrayBuffer(item['file'])
        fr.onload = (data) => {
          const sha256Id = sha256(data.target.result)
          item['fileSha256'] = sha256Id

          examinefileapi(userStore.id, item.folderId, sha256Id, item.fname, item.fext).then((resp) => {
            const { code, message: msg, data } = resp.data
            if (code !== 200) {
              //上传失败
              setUploadType(item, UploadType.Error)
              return message.error(msg)
            }

            if (!data.userFileExist) {
              //用户文件不存在
              if (!data.fileExist) {
                //文件不存在 开始上传
                setUploadType(item, UploadType.Prepare)

                upLoadFun(item)
              } else {
                //秒传文件
                setUploadType(item, UploadType.Fast)
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
              //用户文件已存在
              setUploadType(item, UploadType.Exist)
            }
          })
        }

        // distributionTask()
      }
      //   console.log(m, s)
      //   if (!bool) {
      //     bool = true
      //     driveStore.uploadTaskList.splice(driveStore.uploadTaskList.length - 1, 1)
      //   }
      //   driveStore.uploadTaskList = s.drive.uploadTaskList;

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
            <UploadFloatButtonGroup></UploadFloatButtonGroup>
            {/* <UploadModal onOpenNewFolderModel={onOpenNewFolderModel} uploadTaskList={props.uploadTaskList} uploadRemainingTask={props.uploadRemainingTask}></UploadModal> */}
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

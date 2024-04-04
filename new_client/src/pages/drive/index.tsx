import { defineComponent, onBeforeMount, onMounted, ref, toRaw, watch, withModifiers } from 'vue'
import { DriveEmits, DriveProps } from './type'
import { useAppStore } from '@/store/models/app'
import { useUserStore } from '@/store/models/user'
import { NavigationGuard, onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { adduserfolderapi, batchAddUserFolderApi, deluserfileorfolderapi, getuserfileandfolderapi, getuserfileforfileidapi } from '@/api/drive'
import { Breadcrumb, BreadcrumbItem, Button, Modal, message } from 'ant-design-vue'
import { getvideosceenshotsapi } from '@/api/video'
import { FileAndFloderType } from '@/types/FileAndFolderType'
import './index.less'
import { useGlobalDataStore } from './store/global_data'
import { NewFolder } from '@/pages/home/components/new_folder'
import { DynamicScroller } from 'vue-virtual-scroller'
import { useDriveStore } from '@/store/models/drive'
import { Throttle, wait } from '@/utils/date'
import { GetFileTypeInItem } from '@/utils/FileType'
import { BatchAddUserFolderType } from '@/types/BatchAddUserFolderType'
import { BatchAddUserFileType } from '@/types/BatchAddUserFileType'
import MathTools from '@/utils/MathTools'
import { sha256 } from 'js-sha256'

export default defineComponent<DriveProps, DriveEmits>(
  (props, ctx) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const driveStore = useDriveStore()
    const store = useGlobalDataStore()
    const route = useRoute()
    const router = useRouter()
    const throttle = Throttle(3000)

    const dropAddFolderList = ref<BatchAddUserFolderType[]>([])
    const dropAddFileList = ref<BatchAddUserFileType[]>([])

    /**
     * 获取路由的文件夹id
     */
    const getFolderId = () => {
      const routerFolderId = route.params.folderId ?? ''
      const folderid = (driveStore.currenFolderId = routerFolderId.toString())
      if (folderid == undefined || folderid == '' || folderid == null) {
        return MathTools.RootUUID()
      }

      return typeof folderid == 'string' ? route.params.folderId.toString() : route.params.folderId[0]
    }

    /**
     * 获取用户的文件夹与文件
     * @param value
     */

    const getUserFileAndFolder = async (userUuid: string, folderUuid: string) => {
      //   await throttle()
      getuserfileandfolderapi(userUuid, folderUuid)
        .then((resp) => {
          const { code: code, message: msg, data: data } = resp.data
          if (code !== 200) {
            //上传失败
            return message.error(msg)
          }

          for (let i = 0; i < data.length; i++) {
            data[i].blob = null
          }

          store.fileData = data

          for (let i = 0; i < store.fileData.length; i++) {
            if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'image') {
              ImageToblobUrl(i)
            }
            if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'video') {
              VideoImageToblobUrl(i)
            }
          }
        })
        .catch(() => {
          // $tipMessge.open(err.data.message);
        })
    }

    /**
     * 新建文件夹完成
     * @param value
     */
    const newFolderSubmit = (value: string) => {
      store.showNewFolderModel = false
      adduserfolderapi(userStore.id, getFolderId(), value).then((resp) => {
        const { code, message: msg } = resp.data
        if (code !== 200) {
          return message.error(msg)
        }
        getUserFileAndFolder(userStore.id, getFolderId())
      })
    }

    /**
     * 拖拽进入
     * @param e
     */
    const dragenter = (e: any) => {
      //
      let items = e.dataTransfer.items
      for (let i = 0; i <= items.length - 1; i++) {
        let item = items[i]
        if (item.kind === 'file') {
          //是文件才触发显示效果
          e.dataTransfer.dropEffect = 'copy'
          store.isShowUpdateModel = true
        }
      }
    }

    /**
     * 拖拽持续移动
     * @param e
     */
    const dragover = (e: any) => {
      e.dataTransfer.dropEffect = 'copy'
      store.isShowUpdateModel = true
    }

    /**
     * 拖拽离开
     */
    const dragleave = () => {
      store.isShowUpdateModel = false
    }

    /**
     * 拖拽放入
     * @param e
     */
    const drop = (e: any) => {
      store.isShowUpdateModel = false
      // 修复拖拽获取不了文件的情况
      let items = []
      ;[].forEach.call(
        e.dataTransfer.items,
        function (file) {
          items.push(file)
        },
        false
      )

      const entryPromiseList = []
      items.forEach((item) => {
        if (item.kind === 'file') {
          //是文件和文件夹才触发
          let entry = item.webkitGetAsEntry()
          entryPromiseList.push(getFileFromEntryRecursively(MathTools.RootUUID(), MathTools.UUID(), entry))
        }
      })

      Promise.all(entryPromiseList).then(async () => {
        //同目录文件夹文件递归完成
        await wait(1000)
        console.log('遍历完成1', dropAddFolderList.value)
        console.log('遍历完成1', dropAddFileList.value)

        const dropAddFolderListSlice = []

        for (let i = 0; i < dropAddFolderList.value.length; i += 100) {
          // 100条数据为一个请求
          dropAddFolderListSlice.push(dropAddFolderList.value.slice(i, i + 100))
        }

        const dropAddFolderListSlicePromise = []
        dropAddFolderListSlice.forEach((fitem) =>
          dropAddFolderListSlicePromise.push(
            batchAddUserFolderApi(userStore.id, fitem).then((resp) => {
              const { code, message: msg } = resp.data
              if (code !== 200) {
                return message.error(msg)
              }
            })
          )
        )

        // console.log('获取sha')
        // dropAddFileList.value.forEach((item) => {
        //   // 获取全部文件Sha256
        //   const fr = new FileReader()
        //   fr.readAsArrayBuffer(item['file'])
        //   fr.onload = (data) => {
        //     const sha256Id = sha256(data.target.result)
        //     item['fileSha256'] = sha256Id
        // 	console.log("获取shazhongj")
        //   }
        // })
        // console.log('sha结束')

        //等待新增目录切片请求完成后再处理文件
        Promise.all(dropAddFolderListSlice).then(async () => {
          await wait(10000)
          dropAddFolderList.value = []

          // 检查文件

          dropAddFileList.value.forEach(async (item) => {
            // 添加上传文件任务
            await wait(1000)
            driveStore.uploadTaskList.push(item)
          })

          //   for (let i = 0; i < dropAddFileList.value.length; i++) {
          //     await wait(1000)
          //     driveStore.uploadTaskList.push(dropAddFileList.value[i])
          //   }

          dropAddFileList.value = []
        })
      })
    }

    /**
     * 父级点击
     */
    const driveBodyMouseup = () => {
      store.isShowRightMenu = false
    }

    /**
     * 文件盒子松开鼠标按键
     * @param e
     * @param item
     */
    const fileBoxMouseup = (e: any, item: any) => {
      store.isShowRightMenu = false
      store.showRightMenuType = item === null ? 'default' : item.type

      store.rightMenuItem = item
      //右点击文件与文件夹
      if (e.button == 2) {
        //右键
        store.fileMenuPos.x = e.x
        store.fileMenuPos.y = e.y
        // $set(, "x", e.x);
        // $set(, "y", e.y);
        store.isShowRightMenu = true
      }
    }

    /**
     * 打开文件或打开文件夹
     * @param item
     */
    const openFileOrFolder = (item: any) => {
      if (item.type == 'folder') {
        //给导航添加
        driveStore.navigation.push({ text: item.name, id: item.id })
        //将进入的文件夹的id赋值给全局变量
        driveStore.currenFolderId = item.id
        //将路由跳转
        router.push({ name: 'drive', params: { folderUuid: item.id } })
      } else {
        //打开文件
        message.warn('哦吼,文件预览还不能用')
      }
    }

    /**
     * 单文件处理
     * @param file
     */
    const oneFile = async (file: File) => {
      //
      let filenameAndfext = getFileNameAndFext(file.name)
      let path = `-/${file.name}`

      let fileInfoOBJ = {
        uploadType: 0,
        uploadCurrentChunkNum: 0,
        currentChunkMax: 0,
        file,
        fileSize: file.size,
        fileType: file.type,
        fname: filenameAndfext.fname,
        fext: filenameAndfext.fext,
        filePath: path,
        fileSha256: '',
        folderId: getFolderId(),
        // currentChunkList: []
      }
      // console.log(fileInfoOBJ);

      driveStore.uploadTaskList.push(fileInfoOBJ) //将任务写入数据
    }

    /**
     * 获取文件名和后缀
     * @param value
     */
    const getFileNameAndFext = (value: string) => {
      //
      let fname = ''
      let fext = ''
      if (value.indexOf('.') != -1) {
        fname = value.substring(0, value.lastIndexOf('.')) //获取文件名
        fext = value.substring(value.lastIndexOf('.') + 1) //获取后缀名
      } else {
        fname = value.substring(value.lastIndexOf('.') + 1) //获取文件名
        fext = ''
      }
      return { fname, fext }
    }

    /**
     * 处理文件夹里的文件
     * @param pid
     * @param entry
     */
    const getFileFromEntryRecursively = async (pid: string, folderUuid: string, entry: any) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          const filenameAndfext = getFileNameAndFext(file.name)
          const path = entry.fullPath.substring(1)

          const item = {
            uploadType: 0,
            uploadCurrentChunkNum: 0,
            currentChunkMax: 0,
            file,
            fileSize: file.size,
            fileType: file.type,
            fname: filenameAndfext.fname,
            fext: filenameAndfext.fext,
            filePath: path,
            fileSha256: '',
            folderId: pid,
          }

          const fr = new FileReader()
          fr.readAsArrayBuffer(item['file'])
          fr.onload = (data) => {
            const sha256Id = sha256(data.target.result)
            item['fileSha256'] = sha256Id
            console.log('获取shazhongj')
          }

          dropAddFileList.value.push(item)
        })
      } else {
        //检测到文件夹
        // let createfolderres = await adduserfolderapi(userStore.id, folderId == '0' ? getFolderId() : folderId, entry.name)
        dropAddFolderList.value.push({
          pUuid: pid == MathTools.RootUUID() ? getFolderId() : pid,
          folderUuid: folderUuid,
          folderName: entry.name,
        })
        // console.log(pid, folderUuid, entry.name)

        let reader = entry.createReader()
        reader.readEntries((entries) => {
          for (let i = 0, len = entries.length; i < len; i++) {
            getFileFromEntryRecursively(folderUuid, MathTools.UUID(), entries[i])
          }

          // entries.forEach(entry => getFileFromEntryRecursively(entry));
        })
        //刷新
        // getUserFileAndFolder(userStore.id,getFolderId())
      }
    }

    const openNewFolderModel = () => {
      // 显示新建文件夹模态窗
      store.isShowRightMenu = false
      store.showNewFolderModel = true
    }

    //删除文件或文件夹
    const deleteFileOrFolder = () => {
      store.isShowRightMenu = false
      if (store.rightMenuItem.type == 'file') {
        //删除文件
        Modal.confirm({
          title: '确定删除',
          content: '确定删除该文件嘛?',
          onOk() {
            delFileOrFolder()
          },
        })
      } else {
        //删除文件夹
        Modal.confirm({
          title: '确定删除',
          content: '文件夹内的文件将全部删除,确定删除该文件夹嘛?',
          onOk() {
            delFileOrFolder()
          },
        })
      }
    }
    const delFileOrFolder = () => {
      //删除文件或文件夹
      deluserfileorfolderapi(store.rightMenuItem.id, store.rightMenuItem.type).then((resp) => {
        const { code, message: msg } = resp.data
        if (code !== 200) {
          return message.error(msg)
        }
        message.success(msg)
        getUserFileAndFolder(userStore.id, getFolderId())
      })
    }
    const ImageToblobUrl = (i) => {
      //获取图片数据并返回Blob地址
      getuserfileforfileidapi(store.fileData[i].id)
        .then((res) => {
          let bloburl = URL.createObjectURL(res.data)
          store.fileData[i].blob = bloburl
          // $set(, "blob", bloburl);
        })
        .catch((err) => {
          // $tipMessge.open(err.data.message);
        })
    }
    const VideoImageToblobUrl = (i) => {
      //获取视频预览图数据并返回Blob地址
      getvideosceenshotsapi(store.fileData[i].id)
        .then((res) => {
          if (res.data != null) {
            let bloburl = URL.createObjectURL(res.data)
            store.fileData[i].blob = bloburl
            // $set(, "blob", );
          }
        })
        .catch((err) => {
          // $tipMessge.open(err.data.message);
        })
    }

    const destroyBlobUrl = (blob: string) => {
      //销毁blob地址
      window.URL.revokeObjectURL(blob)
    }

    const getFileData = () => {
      //根据屏幕宽度计算可以显示多少个为一行
      const colNum = Number(Math.abs(appStore.width / 190))
      let arr = []
      //根据返回的数据可以显示几行
      const rowNum = Number(Math.abs(store.fileData?.length ?? 0 / colNum))
      //根据计算检查是否满足一行，不够一行加一行
      const rowNumReal = store.fileData?.length ?? 0 / colNum > rowNum ? rowNum + 1 : rowNum

      for (let i = 0; i < rowNumReal; i++) {
        arr.push([] as FileAndFloderType[])
        for (let j = i * colNum; j < i * colNum + colNum; j++) {
          arr[i].push(store.fileData[j])
        }
      }

      if (arr.length != 0) {
        arr[arr.length - 1] = arr[arr.length - 1].filter((item) => item != void 0)
      }

      return arr.map((item, i) => {
        return {
          key: i,
          data: item,
        }
      })
    }

    //渲染文件列表
    const RenderFileList = (view) => {
      const node = []
      for (let i = 0; i < view.fileData.length; i++) {
        const item = view.fileData[i]
        node.push(
          <div
            class="fileBox"
            onDblclick={() => {
              openFileOrFolder(item)
            }}
            onMouseup={withModifiers((e) => fileBoxMouseup(e, item), ['stop'])}
            onContextmenu={withModifiers(() => {}, ['prevent'])}
          >
            <div class="fileContentBox">
              <div class="fileContentImg">
                {item.type == 'folder' && <img class="imagePreview" src="/src/assets/img/folder.png" draggable="false" />}

                {item.type == 'file' && item.blob != null && (
                  <div class="imgBox">
                    <img class="imagePreview" ref="img" src={item.blob} draggable="false" onLoad={destroyBlobUrl(item.blob)} />
                    <i class="iconfont icon-or-play videoImg" v-if="GetFileTypeInItem(item).type == 'video'"></i>
                  </div>
                )}

                {/* {item.type == 'file' && item.blob == null && <i class={{iconfont:true,iconPreview:true, GetFileTypeInItem(item).iconStr}}></i>} */}
              </div>
              <div class="fileContentText">
                <p class="fileContentName">{`${item.name}  ${item.suffix == null ? '' : `.${item.suffix}`}`}</p>
                <p class="fileContentDate">{item.updateTime.slice(0, item.updateTime.length - 3)}</p>
              </div>
            </div>
          </div>
        )
      }

      return node
    }

    //渲染导航
    const RenderNavigation = () => {
      //   console.log('导航', driveStore.navigation)
      const node = [
        //   <p class={{ toolbarTitle: true, colorR: driveStore.navigation.length >= 1 }}>{driveStore.navigation.length == 0 ? `我的云盘(${store.fileData?.length ?? 0})` : '我的云盘'}</p>
        <BreadcrumbItem>{driveStore.navigation.length == 0 ? `我的云盘(${store.fileData?.length ?? 0})` : '我的云盘'}</BreadcrumbItem>,
      ]

      for (let i = 0; i < driveStore.navigation.length; i++) {
        const item = driveStore.navigation[i]
        node.push(
          <BreadcrumbItem>
            {item.text}
            {i == driveStore.navigation.length - 1 && <span>{`(${store.fileData.length})`}</span>}
          </BreadcrumbItem>
          //   <div style="display: inline-flex" class={{ toolbarOn: i != driveStore.navigation.length - 1 }}>
          //     <p class="toolbarArrow colorR">›</p>

          //   </div>
        )
      }

      return node
    }

    /**
     * 初始化
     */
    onBeforeMount(() => {
      getUserFileAndFolder(userStore.id, getFolderId())
    })

    onBeforeRouteUpdate((updateGuard) => {
      //监听路由变化
      const folderUuid =
        updateGuard.params['folderUuid'] === undefined || updateGuard.params['folderUuid'] === null || updateGuard.params['folderUuid'] === '' ? MathTools.RootUUID() : updateGuard.params['folderUuid']
      getUserFileAndFolder(userStore.id, folderUuid as string)

        const currentFolderList = driveStore.navigation
        //倒序删除导航
        for (let i = currentFolderList.length; i > 0; i--) {
          if (folderUuid != currentFolderList[currentFolderList.length - 1].id) {
            currentFolderList.splice(i - 1, 1)
          } else {
            break
          }
        }
    })

    // onBeforeRouteLeave(()=>{
    // 	console.log("路由切换后")
    // })

    // watch(route, () => {})

    ctx.expose({
      openNewFolderModel,
    })

    return () => {
      return (
        <>
          <div
            class="drive_body"
            // onMouseup={driveBodyMouseup}
            onDragenter={withModifiers(dragenter, ['prevent', 'stop'])}
            onMouseup={withModifiers((e) => fileBoxMouseup(e, null), ['stop'])}
            onContextmenu={withModifiers(() => {}, ['prevent'])}
          >
            <NewFolder v-model:open={store.showNewFolderModel} onSubmit={newFolderSubmit}></NewFolder>

            {store.isShowUpdateModel && (
              <div
                class="draging"
                onDragover={withModifiers(dragover, ['prevent', 'stop'])}
                onDragleave={withModifiers(dragleave, ['prevent', 'stop'])}
                onDrop={withModifiers(drop, ['prevent', 'stop'])}
              >
                <div class="tip" onDragleave={withModifiers(() => {}, ['prevent', 'stop'])}>
                  <p>拖拽文件到此即可上传到XXX</p>
                </div>
              </div>
            )}

            <div class="toolbar">
              <div class="toolbar_item">
                <Breadcrumb class="toolbarTitle" separator=">">
                  {RenderNavigation()}
                </Breadcrumb>
              </div>
            </div>
            <div class="dropZone" ref="recycleScroller">
              {store.fileData.length == 0 && (
                <div class="emptyBox">
                  <img src="/src/assets/img/empty.png" draggable="false" />
                  <p>这里啥也没有呢~</p>
                </div>
              )}

              {store.fileData.length != 0 && (
                <div class="file-container">
                  {RenderFileList(store)}
                  {/* <DynamicScroller items={getFileData()} minItemSize={54} class="scroller">
                  niaho
                </DynamicScroller> */}

                  {/* <DynamicScroller items={getFileData()} class="scroller" min-item-size={1} key-field="key" v-slot="view">
          {{ view }}

          {RenderFileList(view)}
        </DynamicScroller> */}
                </div>
              )}
            </div>

            {store.isShowRightMenu && (
              <div
                class="fileMenu"
                style={{ top: `${store.fileMenuPos?.y ?? 0}px`, left: `${store.fileMenuPos?.x ?? 0}px` }}
                onContextmenu={withModifiers(() => {}, ['prevent'])}
                onMouseup={withModifiers(() => {}, ['stop'])}
              >
                <ul>
                  {store.showRightMenuType == 'default' && (
                    <li onClick={openNewFolderModel}>
                      <i class="iconfont iconfont icon-add-folder"></i>
                      <p>新建文件夹</p>
                    </li>
                  )}

                  {store.showRightMenuType == 'file' && (
                    <li>
                      <i class="iconfont icon-download"></i>
                      <p>下载</p>
                    </li>
                  )}

                  {(store.showRightMenuType == 'file' || store.showRightMenuType == 'folder') && (
                    <li>
                      <i class="iconfont icon iconfont icon-move"></i>
                      <p>移动</p>
                    </li>
                  )}

                  {(store.showRightMenuType == 'file' || store.showRightMenuType == 'folder') && (
                    <li>
                      <i class="iconfont iconfont icon-edit"></i>
                      <p>重命名</p>
                    </li>
                  )}

                  {store.showRightMenuType == 'file' && (
                    <li>
                      <i class="iconfont iconfont icon-yun"></i>
                      <p>公开文件</p>
                    </li>
                  )}

                  {(store.showRightMenuType == 'file' || store.showRightMenuType == 'folder') && (
                    <li>
                      <i class="iconfont iconfont icon-hook"></i>
                      <p>进入多选</p>
                    </li>
                  )}

                  {(store.showRightMenuType == 'file' || store.showRightMenuType == 'folder') && (
                    <li v-if="">
                      <i class="iconfont iconfont icon-info"></i>
                      <p>查看详情信息</p>
                    </li>
                  )}

                  {(store.showRightMenuType == 'file' || store.showRightMenuType == 'folder') && (
                    <li onClick={deleteFileOrFolder} class="del">
                      <i class="iconfont iconfont icon-delete"></i>
                      <p>删除</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </>
      )
    }
  },
  {
    name: '_drive',
    props: ['width', 'height'],
    emits: [],
  }
)

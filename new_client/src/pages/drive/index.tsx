import { defineComponent, onBeforeMount, onMounted, toRaw, watch, withModifiers } from 'vue'
import { DriveEmits, DriveProps } from './type'
import { useAppStore } from '@/store/models/app'
import { useUserStore } from '@/store/models/user'
import { useRoute, useRouter } from 'vue-router'
import { adduserfolderapi, deluserfileorfolderapi, getuserfileandfolderapi, getuserfileforfileidapi } from '@/api/drive'
import { Button, Modal, message } from 'ant-design-vue'
import { getvideosceenshotsapi } from '@/api/video'
import { FileAndFloderType } from '@/types/FileAndFloderType'
import './index.less'
import { useGlobalDataStore } from './store/global_data'
import { NewFolder } from '@/pages/home/components/new_folder'
import { DynamicScroller } from 'vue-virtual-scroller'
import { useDriveStore } from '@/store/models/drive'
import { Throttle } from '@/utils/date'
import { GetFileTypeInItem } from '@/utils/FileType'

export default defineComponent<DriveProps, DriveEmits>(
  (props, ctx) => {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const driveStore = useDriveStore()
    const store = useGlobalDataStore()
    const route = useRoute()
    const router = useRouter()
    const throttle = Throttle(3000)

    /**
     * 获取路由的文件夹id
     */
    const getFolderId = () => {
      const routerFolderId = route.params.folderId ?? ''
      const folderid = (driveStore.currenFolderId = routerFolderId.toString())
      if (folderid == undefined || folderid == '' || folderid == null) {
        return '0'
      }

      return typeof folderid == 'string' ? route.params.folderId.toString() : route.params.folderId[0]
    }

    /**
     * 获取用户的文件夹与文件
     * @param value
     */

    const getUserFileAndFolder = async (value: string) => {
      await throttle()
      getuserfileandfolderapi(userStore.id, value)
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
     * 添加用户文件夹
     * @param value
     */
    const newFolderSubmit = (value: string) => {
      store.showNewFolderModel = false
      adduserfolderapi(userStore.id, getFolderId(), value).then((resp) => {
        const { code, message: msg } = resp.data
        if (code !== 200) {
          return message.error(msg)
        }
        getUserFileAndFolder(getFolderId())
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
      items.forEach((item) => {
        if (item.kind === 'file') {
          //是文件才触发
          let entry = item.webkitGetAsEntry()
          getFileFromEntryRecursively('0', entry)
        }
      })
    }

    /**
     * 父级点击
     */
    const driveBodyMouseup = () => {
      store.isShowRightMenu = false
    }

    /**
     *
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
        router.push({ name: 'drive', params: { folderId: item.id } })
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

      driveStore.uploadBufferPool.push(fileInfoOBJ) //将任务写入数据
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
     * @param folderId
     * @param entry
     */
    const getFileFromEntryRecursively = async (folderId: string, entry: any) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          let filenameAndfext = getFileNameAndFext(file.name)

          let path = entry.fullPath.substring(1)

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
            folderId: folderId == '0' ? getFolderId() : folderId,
            // currentChunkList: []
          }
          // console.log(fileInfoOBJ);
          driveStore.uploadBufferPool.push(fileInfoOBJ) //将任务写入数据
        })
      } else {
        //检测到文件夹
        let createfolderres = await adduserfolderapi(userStore.id, folderId == '0' ? getFolderId() : folderId, entry.name)

        let reader = entry.createReader()
        reader.readEntries((entries) => {
          for (let i = 0, len = entries.length; i < len; i++) {
            getFileFromEntryRecursively(createfolderres.data.data, entries[i])
          }

          // entries.forEach(entry => getFileFromEntryRecursively(entry));
        })
        //刷新
        getUserFileAndFolder(getFolderId())
      }
    }

    const openNewFolderModel = () => {
      // 显示新建文件夹模态窗
      store.isShowRightMenu = false
      store.showNewFolderModel = true
    }

    const openNewFileModel = () => {
      //显示新建文件模态窗
      props.isShowNewFileModel = true
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
        getUserFileAndFolder(getFolderId())
      })
    }
    const ImageToblobUrl = (i) => {
      //获取图片数据并返回Blob地址
      getuserfileforfileidapi(store.fileData[i].id)
        .then((res) => {
          let bloburl = window.URL.createObjectURL(res.data)
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
            let bloburl = window.URL.createObjectURL(res.data)
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

    /**
     * 初始化
     */
    onBeforeMount(() => {
      getUserFileAndFolder(getFolderId())
    })

    watch(route, () => {
      //监听路由变化
      getUserFileAndFolder(getFolderId())
      const currentFolderList = driveStore.navigation

      //倒序删除导航
      for (let i = currentFolderList.length; i > 0; i--) {
        if (getFolderId() != currentFolderList[currentFolderList.length - 1].id) {
          currentFolderList.splice(i - 1, 1)
        } else {
          break
        }
      }
    })

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
              <div class="toolbarLeft">
                <p class={{ toolbarTitle: true, colorR: driveStore.navigation.length >= 1 }}>{driveStore.navigation.length == 0 ? `我的云盘(${store.fileData?.length ?? 0})` : '我的云盘'}</p>
                {/* <div v-for="(item, index) in driveStore.navigation" :key="item.id" style="display: inline-flex" :class="{ toolbarOn: index != driveStore.navigation.length - 1 }">
          <P class="toolbarArrow colorR">›</P>
          <p class="toolbarTitle" :class="{ colorR: index != driveStore.navigation.length - 1 }">
            {{ item.text }}<span v-if="index == driveStore.navigation.length - 1">({{ store.fileData.length }})</span>
          </p>
        </div> */}
              </div>
              <div class="toolbarRight">
                <div class="updateButton" onClick={openNewFileModel}>
                  <i class="iconfont icon-add"></i>
                  <p>新建</p>
                </div>
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
                    <li onClick={deleteFileOrFolder}>
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
    props: ['width', 'height', 'isShowlVideo', 'videoList', 'isShowNewFileModel', 'isShowRightMenu', 'showRightMenuType', 'rightMenuItem', 'fileData'],
    emits: [],
  }
)

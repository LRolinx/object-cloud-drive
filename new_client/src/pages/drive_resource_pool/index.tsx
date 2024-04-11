import { getfolderandfileapi } from '@/api/resource_pool'
import { message } from 'ant-design-vue'
import { defineComponent, onBeforeMount } from 'vue'
import { useGlobalDataStore } from './store/global_data'

export default defineComponent(
  () => {
    const store = useGlobalDataStore()
    /**
     * 打开文件或打开文件夹
     * @param item
     */
    const openFileOrFolder = (item: any) => {
      if (item.type == 'folder') {
        // //给导航添加
        // driveStore.navigation.push({ text: item.name, id: item.id })
        // //将进入的文件夹的id赋值给全局变量
        // driveStore.currenFolderId = item.id
        // //将路由跳转
        // router.push({ name: 'drive', params: { folderUuid: item.id } })

        getfolderandfileapi(item.path)
          .then((resp) => {
            const { code: code, message: msg, data: data } = resp.data
            if (code !== 200) {
              //上传失败
              return message.error(msg)
            }

            store.fileData = data

            //   for (let i = 0; i < store.fileData.length; i++) {
            //     if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'image') {
            //       ImageToblobUrl(i)
            //     }
            //     if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'video') {
            //       VideoImageToblobUrl(i)
            //     }
            //   }
          })
          .catch(() => {
            // $tipMessge.open(err.data.message);
          })
      } else {
        //打开文件
        message.warn('哦吼,文件预览还不能用')
      }
    }

    //渲染文件列表
    const RenderFileList = () => {
      const node = []
      for (let i = 0; i < store.fileData.length; i++) {
        const item = store.fileData[i]
        node.push(
          <div
            class="fileBox"
            onDblclick={() => {
              openFileOrFolder(item)
            }}
          >
            <div class="fileContentBox">
              <div class="fileContentImg">
                {item.type == 'folder' && <img class="imagePreview" src="/src/assets/img/folder.png" draggable="false" />}

                {item.type == 'file' && item.blob != null && (
                  <div class="imgBox">
                    <img
                      class="imagePreview"
                      ref="img"
                      src={item.blob}
                      draggable="false"
                      onLoad={() => {
                        window.URL.revokeObjectURL(item.blob)
                      }}
                    />
                    <i class="iconfont icon-or-play videoImg" v-if="GetFileTypeInItem(item).type == 'video'"></i>
                  </div>
                )}

                {/* {item.type == 'file' && item.blob == null && <i class={{iconfont:true,iconPreview:true, GetFileTypeInItem(item).iconStr}}></i>} */}
              </div>
              <div class="fileContentText">
                <p class="fileContentName">{`${item.name}  ${item.suffix == null ? '' : `.${item.suffix}`}`}</p>
                {/* <p class="fileContentDate">{item.updateTime.slice(0, item.updateTime.length - 3)}</p> */}
              </div>
            </div>
          </div>
        )
      }

      return node
    }

    onBeforeMount(() => {
      getfolderandfileapi()
        .then((resp) => {
          const { code: code, message: msg, data: data } = resp.data
          if (code !== 200) {
            //上传失败
            return message.error(msg)
          }

          store.fileData = data

          //   for (let i = 0; i < store.fileData.length; i++) {
          //     if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'image') {
          //       ImageToblobUrl(i)
          //     }
          //     if (store.fileData[i].type == 'file' && GetFileTypeInItem(store.fileData[i]).type == 'video') {
          //       VideoImageToblobUrl(i)
          //     }
          //   }
        })
        .catch(() => {
          // $tipMessge.open(err.data.message);
        })
    })

    return () => {
      return (
        <>
          <div class="dropZone" ref="recycleScroller">
            {store.fileData.length == 0 && (
              <div class="emptyBox">
                <img src="/src/assets/img/empty.png" draggable="false" />
                <p>这里啥也没有呢~</p>
              </div>
            )}

            {store.fileData.length != 0 && <div class="file-container">{RenderFileList()}</div>}
          </div>
        </>
      )
    }
  },
  {
    name: 'driveResourcePool',
    props: [],
    emits: [],
  }
)

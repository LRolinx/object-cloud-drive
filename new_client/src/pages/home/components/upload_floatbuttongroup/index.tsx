import { Button, FloatButton, FloatButtonGroup, Popconfirm, Progress, Space, Tooltip, Tour, TourProps, Upload } from 'ant-design-vue'
import { defineComponent, ref, watch, onBeforeMount, computed } from 'vue'
import './index.less'
import { CloudUploadOutlined, FileAddTwoTone, FolderAddTwoTone } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'
import { UploadModal } from '../upload_modal'
import { UploadType } from '@/types/UploadType'
import { useAppStore } from '@/store/models/app'

export const UploadFloatButtonGroup = defineComponent(
  (_, ctx) => {
    const taskNum = ref(0)
    const appStore = useAppStore()
    const driveStore = useDriveStore()
    const openUploadModal = ref(true)

    //新建文件夹
    const openNewFolderModel = () => ctx.emit('openNewFolderModel')

    //打开上传模态窗切换
    const handleOpen = () => {
      openUploadModal.value = !openUploadModal.value
    }

    //计算正在进行的任务数量
    const calculateTaskNum = () => {
      const taskArr = driveStore.uploadTaskList.filter((x) => x['uploadType'] == UploadType.Waiting || x['uploadType'] == UploadType.Prepare || x['uploadType'] == UploadType.Checkout || x['uploadType'] == UploadType.Conduct)
      taskNum.value = taskArr.length
      return taskArr.length
    }

    watch(
      () => appStore.counter,
      () => {
        calculateTaskNum()
      },
    )

    return () => {
      return (
        <>
          <div class="upload_floatbuttongroup">
            <UploadModal open={openUploadModal.value}></UploadModal>

            <FloatButtonGroup trigger="hover" style={{ right: '84px' }}>
              <Space direction="vertical">
                <Upload multiple={true}>
                  <Tooltip placement="left" title="上传文件">
                    <Button size="large" shape="circle">
                      <FileAddTwoTone />
                    </Button>
                  </Tooltip>
                </Upload>

                <Tooltip placement="left" title="新建文件夹">
                  <Button size="large" shape="circle" onClick={openNewFolderModel}>
                    <FolderAddTwoTone />
                  </Button>
                </Tooltip>
              </Space>
            </FloatButtonGroup>

            <FloatButton onClick={handleOpen} badge={{ count: taskNum.value }} shape="square" description={<CloudUploadOutlined />}></FloatButton>
          </div>
        </>
      )
    }
  },
  {
    name: 'UploadFloatButtonGroup',
    props: [],
    emits: [],
  }
)

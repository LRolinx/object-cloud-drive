import { Button, FloatButton, FloatButtonGroup, Popconfirm, Progress, Space, Tooltip, Tour, TourProps, Upload } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import './index.less'
import { CloudUploadOutlined, FileAddTwoTone, FolderAddTwoTone } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'
import { UploadModal } from '../upload_modal'

export const UploadFloatButtonGroup = defineComponent(
  (_, ctx) => {
    const driveStore = useDriveStore()
    const openUploadModal = ref(false)

    //新建文件夹
    const openNewFolderModel = () => ctx.emit('openNewFolderModel')

    //打开上传模态窗切换
    const handleOpen = () => {
      openUploadModal.value = !openUploadModal.value
    }

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

            <FloatButton onClick={handleOpen} badge={{ count: driveStore.uploadBufferPool.length }} shape="square" description={<CloudUploadOutlined />}></FloatButton>
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

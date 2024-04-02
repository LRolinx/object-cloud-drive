import { Button, FloatButton, FloatButtonGroup, Popconfirm, Space, Tooltip, Tour, TourProps, Upload } from 'ant-design-vue'
import { createVNode, defineComponent, ref } from 'vue'
import './index.less'
import { CloudUploadOutlined, FileAddTwoTone, FolderAddTwoTone, PlusCircleOutlined } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'

export const UploadModal = defineComponent(
  (props, ctx) => {
    const driveStore = useDriveStore()
    const ref1 = ref()
    const open = ref(false)
	
    //新建文件夹
    const openNewFolderModel = () => ctx.emit('openNewFolderModel')

    const handleOpen = () => {
      open.value = !open.value
    }

    const steps: TourProps['steps'] = [
      {
        // title: 'Upload File',
        // description: <div>你好2</div>,
        cover: <div>你好</div>,
        target: () => ref1.value && ref1.value.$el,
      },
    ]

    return () => {
      return (
        <>
          <div class="upload_modal">
            <Tour class="myTour" placement="topRight" open={open.value} mask={false} steps={steps} onClose={handleOpen} />

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

            <FloatButton onClick={handleOpen} ref={ref1} badge={{ count: driveStore.uploadBufferPool.length }} shape="square" description={<CloudUploadOutlined />}></FloatButton>
          </div>
        </>
      )
    }
  },
  {
    name: 'UploadModal',
    props: [],
    emits: ['openNewFolderModel'],
  }
)

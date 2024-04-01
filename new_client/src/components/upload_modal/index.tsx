import { Button, FloatButton, Popconfirm, Tour, TourProps } from 'ant-design-vue'
import { createVNode, defineComponent, ref } from 'vue'
import './index.less'
import { CloudUploadOutlined } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'

export const UploadModal = defineComponent(
  (props, ctx) => {
	const driveStore = useDriveStore()
    const ref1 = ref()
    const open = ref(false)

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

            {/* <Popconfirm placement="topRight" ok-text="Yes" cancel-text="No">
              
            </Popconfirm> */}

            <FloatButton onClick={handleOpen} ref={ref1} badge={{ count: driveStore.uploadBufferPool.length }} shape="square" description={<CloudUploadOutlined />}></FloatButton>
          </div>
        </>
      )
    }
  },
  {
    name: 'UploadModal',
    props: [],
    emits: [],
  }
)

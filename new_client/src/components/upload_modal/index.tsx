import { Button, FloatButton, FloatButtonGroup, Popconfirm, Progress, Space, Tooltip, Tour, TourProps, Upload } from 'ant-design-vue'
import { createVNode, defineComponent, onBeforeMount, reactive, ref, nextTick } from 'vue'
import './index.less'
import { CloudUploadOutlined, DashboardTwoTone, FileAddTwoTone, FolderAddTwoTone, PlusCircleOutlined } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'
import { VXETable, VxeGrid, VxeGridInstance, VxeGridProps } from 'vxe-table'

export const UploadModal = defineComponent(
  (props, ctx) => {
    const driveStore = useDriveStore()

    //空表格渲染
    VXETable.renderer.add('NotData', {
      // 空内容模板
      renderEmpty() {
        return (
          <Space>
            {/* <img src="https://pic2.zhimg.com/50/v2-f7031359103859e1ed38559715ef5f3f_hd.gif" /> */}
            <p>没有上传任务</p>
          </Space>
        )
      },
    })

    const vxeGridRef = ref<VxeGridInstance>() as any
    const vxeGridProps = reactive<VxeGridProps>({
      size: 'small',
      showHeader: false,
      showFooter: false,
      showOverflow: true,
      showHeaderOverflow: true,
      round: true,
      emptyRender: { name: 'NotData' },
      minHeight: '300px',
      maxHeight: '300px',
      // 横向虚拟滚动
      scrollX: {
        enabled: true,
      },
      // 纵向虚拟滚动
      scrollY: {
        enabled: true,
      },
      columnConfig: {
        isCurrent: true,
        resizable: false,
      },
      rowConfig: {
        height: 50,
        isCurrent: true,
        isHover: true,
      },
      columns: [
        {
          title: '文件名',
          //   width: 120,
          field: 'uploadTask',
          slots: {
            default: ({ row }) => {
              return (
                <Space>
                  <DashboardTwoTone style={{ fontSize: '24px' }} />
                  {/* <Space size={0} direction="vertical" style={{padding:'10px 0'}}>
                    <div>hello.word</div>
                    <div>500MB</div>
                  </Space> */}
                  <div>
                    <div  style={{fontSize:'14px'}}>hello.word</div>
                    <div style={{fontSize:'12px',color:'#999'}}>500MB</div>
                  </div>
                </Space>
              )
            },
          },
        },
        {
          title: '进度',
          width: 120,
          field: 'percent',
          slots: {
            default: ({ row }) => {
              return <Progress percent={row['percent']} style={{ margin: '0' }}></Progress>
            },
          },
        },
      ],
      data: [{ percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }, { percent: 0 }],
    })

    const ref1 = ref()
    const open = ref(false)

    //新建文件夹
    const openNewFolderModel = () => ctx.emit('openNewFolderModel')

    const handleOpen = () => {
      open.value = !open.value
    }

    const steps: TourProps['steps'] = [
      {
        cover: <VxeGrid ref={vxeGridRef} {...vxeGridProps}></VxeGrid>,
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

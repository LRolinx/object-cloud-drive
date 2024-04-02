import { Progress, Space } from 'ant-design-vue'
import { defineComponent, reactive, ref, nextTick, watch, onBeforeMount } from 'vue'
import './index.less'
import { CloudUploadOutlined, DashboardTwoTone } from '@ant-design/icons-vue'
import { useDriveStore } from '@/store/models/drive'
import { VXETable, VxeGrid, VxeGridInstance, VxeGridProps } from 'vxe-table'
import { UploadType } from '@/types/UploadType'

export const UploadModal = defineComponent(
  (props, _) => {
    const driveStore = useDriveStore()

    //空表格渲染
    VXETable.renderer.add('NotData', {
      // 空内容模板
      renderEmpty() {
        return (
          <Space direction="vertical">
            <CloudUploadOutlined style={{ fontSize: '36px' }} />
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
                  <div>
                    <div style={{ fontSize: '14px' }}>{`${row['fname']}.${row['fext']}`}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{row['fileSize']}</div>
                  </div>
                </Space>
              )
            },
          },
        },
        {
          title: '进度',
          //   width: 120,
          align: 'right',
          field: 'uploadCurrentChunkNum',
          slots: {
            default: ({ row }) => {
              if (row['uploadType'] == UploadType.Waiting) {
                return '等待中'
              }

              if (row['uploadType'] == UploadType.Prepare) {
                return '准备中'
              }

              if (row['uploadType'] == UploadType.Exist) {
                return '文件已存在'
              }

              if (row['uploadType'] == UploadType.Small) {
                return '文件太小'
              }

              if (row['uploadType'] == UploadType.Big) {
                return '文件太大'
              }

              if (row['uploadType'] == UploadType.Error) {
                return '上传错误'
              }

              // 5秒传 6上传中 7完成
              if (row['uploadType'] == UploadType.Fast || row['uploadType'] == UploadType.Conduct || row['uploadType'] == UploadType.Success) {
                return <Progress percent={calculateTaskPercent(row)} style={{ margin: '0' }}></Progress>
              }

              return
            },
          },
        },
      ],
      data: [],
    })

    // 计算任务进度
    const calculateTaskPercent = (row) => {
      const percent = (100 / row['currentChunkMax']) * row['uploadCurrentChunkNum']
      return parseInt(percent.toString())
    }

    //初始化
    const init = () => {
      nextTick(() => {
        const grid = vxeGridRef.value
        if (grid == void 0) return
        grid.loadData(driveStore.uploadTaskList)
        // grid.getTableData().fullData = driveStore.uploadBufferPool

        // console.log(driveStore.uploadBufferPool)
      })
    }

    watch(
      () => props.open,
      () => {
        if (props.open) {
          nextTick(() => init())
        }
      }
    )

    watch(
      () => driveStore.uploadTaskList,
      () => nextTick(() => init()),
      {
        deep: true,
      }
    )

    onBeforeMount(() => nextTick(() => init()))

    return () => {
      return (
        <>
          {props.open && (
            <div class="upload_modal">
              <VxeGrid ref={vxeGridRef} {...vxeGridProps}></VxeGrid>
            </div>
          )}
        </>
      )
    }
  },
  {
    name: 'UploadModal',
    props: ['open'],
    emits: [],
  }
)

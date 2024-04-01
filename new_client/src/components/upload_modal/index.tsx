import { FloatButton } from 'ant-design-vue'
import { defineComponent } from 'vue'
import './index.less'

export const UploadModal = defineComponent(
  (props, ctx) => {
    return () => {
      return (
        <>
          <div class="upload_modal">
		  <FloatButton badge={{ count: 5 }} tooltip={<div>无上传任务</div>}></FloatButton>
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

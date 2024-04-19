import { Button, Result } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent(
  () => {
    const router = useRouter()
    const goBack = () => {
      router.back()
    }
    return () => {
      return (
        <>
          <div style="position: fixed; width: 100vw; height: 100vh; z-index: 14; background: white">
            <Result
              status="404"
              title="404"
              sub-title="页面不存在"
              extra={
                <Button type="primary" onClick={goBack}>
                  返回
                </Button>
              }
            ></Result>
          </div>
        </>
      )
    }
  },
  {
    name: 'NotFoundPage',
    props: [],
    emits: [],
  }
)

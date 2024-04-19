import { defineComponent } from 'vue'
import { LoadingAEmits, LoadingAProps } from './type'

export const LoadingA = defineComponent<LoadingAProps, LoadingAEmits>(
  (props) => {
    return () => {
      return (
        <>
          {props.open && (
            <div class="loading">
              <div class="loadingspinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
              </div>
            </div>
          )}
        </>
      )
    }
  },
  {
    props: ['open'],
    emits: ['update:open'],
  }
)

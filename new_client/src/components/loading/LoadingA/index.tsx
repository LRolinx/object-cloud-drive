import { defineComponent } from 'vue'
import { LoadingAEmits, LoadingAProps } from './type'
import './index.less'

export const LoadingA = defineComponent<LoadingAProps, LoadingAEmits>(
  (props) => {
    return () => {
      return (
        <>
          {props.open && (
            <div class="loadingmask">
              <div class="spinner">
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
  },
)

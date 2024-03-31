import { defineComponent, ref, watch, withModifiers } from 'vue'
import './index.less'
import { NewFolderEmits, NewFolderProps } from './type'

export const NewFolder = defineComponent<NewFolderProps, NewFolderEmits>(
  (props, ctx) => {
    const folderName = ref(undefined)

    const keyDown = (e) => {
      switch (e.keyCode) {
        case 13:
          success()
          break
      }
    }

    // 完成
    const success = () => {
      ctx.emit('submit', folderName.value)
    }

    //关闭
    const close = () => {
      //关闭新建文件模态窗
      ctx.emit('update:open', false)
    }

    watch(
      () => props.open,
      () => {
        if (props.open) {
          folderName.value = undefined
        }
      }
    )

    return () => {
      return (
        <>
          {props.open && (
            <div class="componentBody">
              <div class="mask" onClick={close}>
                <div class="newFolderBox" onClick={withModifiers(() => {}, ['stop'])}>
                  <div class="contentBox">
                    <p>新建文件夹</p>
                    <input class="zp-input" v-model={folderName.value} onKeypress={keyDown} placeholder="文件夹名称" autofocus maxlength="64" />
                    <button type="button" class="button" onClick={success}>
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )
    }
  },
  {
    name: 'NewFolder',
    props: ['open'],
    emits: ['update:open', 'onSubmit'],
  }
)

import { defineComponent, ref } from 'vue'
import { VerificationCodeInputProps, VerificationCodeInputEmits } from './type'
import './index.less'

export const VerificationCodeInput = defineComponent<VerificationCodeInputProps, VerificationCodeInputEmits>(
  (props, ctx) => {
    const codeInput = ref()
    const isInput = ref(false)
    const inputValue = ref(undefined)

    const clickInput = () => {
      //点击输入框
      isInput.value = true
      codeInput.value.focus()
    }

    const blurInput = () => {
      //聚焦取消
      isInput.value = false
    }

    const keyDown = (e) => {
      //屏蔽部分按键
      if (e.keyCode == 37) {
        //左键
        e.returnValue = false
      }
      if (e.keyCode == 38) {
        //上键
        e.returnValue = false
      }
      if (e.keyCode == 39) {
        //右键
        e.returnValue = false
      }
      if (e.keyCode == 40) {
        //下键
        e.returnValue = false
      }
    }

    // 验证码输入
    const onInput = () => {
      ctx.emit('update:value', inputValue.value)
    }

    //渲染自定义验证码
    const renderCode = () => {
      const node = []
      for (let i = 0; i < props.maxLength; i++) {
        node.push(
          <div class={{ inputItem: true, focus: i == (inputValue.value?.length ?? 0) && isInput.value }} onClick={clickInput}>
            {inputValue.value?.[i] ?? undefined}
          </div>
        )
      }
      return node
    }

    return () => {
      return (
        <>
          <div class="verification_code_input">
            <div class="verificationCodeInputBox">
              <input
                class="codeInput"
                ref={codeInput}
                maxlength={props.maxLength}
                placeholder={props.placeholder}
                onBlur={blurInput}
                v-model={inputValue.value}
                onInput={onInput}
                onKeydown={keyDown}
              />
              {renderCode()}
            </div>
          </div>
        </>
      )
    }
  },
  {
    name: 'VerificationCodeInput',
    props: ['maxLength', 'placeholder', 'value'],
    emits: ['update:value'],
  }
)

import { defineComponent, getCurrentInstance, onBeforeMount, ref } from 'vue'
import './index.less'
import { useUserStore } from '@/store/models/user'
import { loginapi, registeredapi } from '@/api/user'
import { VerificationCodeInput } from '@/components/verification_code_input'
import { message } from 'ant-design-vue'
import MathTools from '@/utils/MathTools'
import { useRoute } from 'vue-router'

export default defineComponent(
  () => {
    const isRegistered = ref(false)
    const nickName = ref(undefined)
    const account = ref(undefined)
    const password = ref(undefined)
    const confirmPassword = ref(undefined)
    const registeredCode = ref(undefined)
    const rememberMe = ref(false)
    const { proxy } = getCurrentInstance()
    const userStore = useUserStore()

    const encryption = (str) => {
      //加密
      let num1 = window.btoa(str).replace(/=/g, '··')
      let num2 = window.btoa(num1).replace(/=/g, 's+')
      return num2
    }
    const decrypt = (str) => {
      //解密
      let num1 = window.atob(str.replace(/s\+/g, '='))
      let num2 = window.atob(num1.replace(/··/g, '='))
      return num2
    }

    //切换记住我开关
    const switchRememberMe = () => {
      rememberMe.value = !rememberMe.value
    }
    //切换到登录
    const switchLogin = () => {
      document.title = '登录对象云盘'
      isRegistered.value = false
      resetInput()
      //   const container = document.querySelector('.login_content')
      //   container.classList.remove('sign_up_mode')
    }
    //切换到注册
    const switchRgistered = () => {
      document.title = '注册对象云盘'
      isRegistered.value = true
      resetInput()
      //   const container = document.querySelector('.login_content')
      //   container.classList.add('sign_up_mode')
    }
    //监听键盘
    const keydown = (e) => {
      if (e.keyCode == 13) {
        if (!isRegistered.value) {
          login()
        } else {
          registered()
        }
      }
    }
    //登录检查
    const loginCheck = () => {
      if (account.value == undefined || account.value.trim() == '') {
        message.warn('用户名不能为空')
        return false
      }
      if (password.value == undefined || password.value.trim() == '') {
        message.warn('密码不能为空')
        return false
      }

      return true
    }
    //登录
    const login = () => {
      if (!loginCheck()) return
      const rsaaccount = MathTools.encryptForKey(account.value)
      const rsapass = MathTools.encryptForKey(password.value)
      loginapi(rsaaccount, rsapass).then((resp) => {
        const { code, message: msg, data } = resp.data
        if (code !== 200) {
          return message.error(msg)
        }
        message.success(msg)
        if (rememberMe.value) {
          localStorage.setItem('account', encryption(account.value))
          localStorage.setItem('password', encryption(password.value))
        } else {
          localStorage.removeItem('account')
          localStorage.removeItem('password')
        }

        userStore.isLogin = true
        userStore.id = data.userUuid
        userStore.photo = data.photo
        userStore.nickname = data.nickName
        proxy.$router.push({ name: 'drive' })
      })
    }
    //注册检查
    const registeredCheck = () => {
      if (nickName.value == undefined || nickName.value.trim() == '') {
        message.warn('昵称不能为空')
        return false
      }
      if (account.value == undefined || account.value.trim() == '') {
        message.warn('用户名不能为空')
        return false
      }
      if (password.value == undefined || password.value.trim() == '') {
        message.warn('密码不能为空')
        return false
      }
      if (confirmPassword.value == undefined || confirmPassword.value.trim() == '') {
        message.warn('确认密码不能为空')
        return false
      }
      if (registeredCode.value == undefined || registeredCode.value.trim() == '') {
        message.warn('注册码不能为空')
        return false
      }

      if (password.value != confirmPassword.value) {
        message.warn('确认密码和密码不相同')
        password.value = undefined
        confirmPassword.value = undefined
        return false
      }

      return true
    }

    //注册
    const registered = () => {
      if (!registeredCheck()) return
      const rsaaccount = MathTools.encryptForKey(account.value)
      const rsapass = MathTools.encryptForKey(password.value)

      registeredapi(nickName.value, rsaaccount, rsapass, registeredCode.value).then((resp) => {
        const { code, message: msg } = resp.data
        if (code !== 200) {
          return message.error(msg)
        }
        message.success(msg)
        switchLogin()
      })
    }

    //重置所有输入
    const resetInput = () => {
      nickName.value = undefined
      account.value = undefined
      password.value = undefined
      confirmPassword.value = undefined
      registeredCode.value = undefined
    }

    onBeforeMount(async () => {
      // 初始化
      if (localStorage.getItem('account') != null) {
        account.value = decrypt(localStorage.getItem('account'))
      }

      if (localStorage.getItem('password') != null) {
        password.value = decrypt(localStorage.getItem('password'))
      }
      if (account.value && password.value) {
        rememberMe.value = true
      }
    })

    return () => {
      return (
        <>
          <div class={{ login_and_registered: true, sign_up_mode: isRegistered.value }}>
            <div class="form-warp" onKeydown={keydown}>
              <form class="sign-in-form">
                <h6 class="form-title">登录</h6>
                <input v-model={account.value} type="text" placeholder="用户名" />
                <input v-model={password.value} type="password" placeholder="密码" />

                <div class="rememberMeBox">
                  <label class="rememberMeBoxLabel">记住账号</label>
                  <div class={{ switchBox: true, switchBoxOn: rememberMe.value }} onClick={switchRememberMe}>
                    <div class={{ switch: true, switchOn: rememberMe.value }}></div>
                  </div>
                </div>
                <div class="submit-btn" onClick={login}>
                  立即登录
                </div>
              </form>

              <form class="sign-up-form">
                <h6 class="form-title">注册</h6>
                <input v-model={nickName.value} type="text" placeholder="昵称" maxlength="32" />
                <input v-model={account.value} type="text" placeholder="用户名" maxlength="32" />
                <input v-model={password.value} type="password" placeholder="密码" maxlength="32" />
                <input v-model={confirmPassword.value} type="password" placeholder="重复密码" maxlength="32" />
                <div class="verificationCodeInputBox">
                  <VerificationCodeInput class="verificationCodeInput" maxLength={6} placeholder="注册码" v-model:value={registeredCode.value}></VerificationCodeInput>
                </div>
                <div class="submit-btn" onClick={registered}>
                  立即注册
                </div>
              </form>
            </div>

            <div class="desc-warp">
              <div class="desc-warp-item sign-up-desc">
                <div class="login_content" style="min-height:34px">
                  {!isRegistered.value && (
                    <button id="sign-up-btn" onClick={switchRgistered}>
                      注册
                    </button>
                  )}
                </div>
                <img src="/src/assets/log.svg" alt="" />
              </div>
              <div class="desc-warp-item sign-in-desc">
                <div class="login_content" style="min-height:34px">
                  {isRegistered.value && (
                    <button id="sign-in-btn" onClick={switchLogin}>
                      登录
                    </button>
                  )}
                  {/* <button id="sign-in-btn" onClick={switchLogin}>
                    登录
                  </button> */}
                </div>
                <img src="/src/assets/register.svg" alt="" />
              </div>
            </div>
          </div>
        </>
      )
    }
  },
  {
    name: 'login_and_registered',
    props: [],
    emits: [],
  }
)

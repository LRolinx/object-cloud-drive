<!--
 * @Author: LRolinx
 * @Date: 2021-10-23 10:40:52
 * @LastEditTime: 2022-03-16 17:45:34
 * @Description: 登录与注册
 *
-->
<template>
  <div class="container">
    <div class="form-warp" @keydown="keydown">
      <form class="sign-in-form">
        <h6 class="form-title">登录</h6>
        <input v-model="account" type="text" placeholder="用户名" />
        <input v-model="password" type="password" placeholder="密码" />

        <div class="rememberMeBox">
          <label class="rememberMeBoxLabel">记住账号</label>
          <div class="switchBox" :class="{ switchBoxOn: rememberMe }" @click="switchRememberMe">
            <div class="switch" :class="{ switchOn: rememberMe }"></div>
          </div>
        </div>

        <div class="submit-btn" @click="login">立即登录</div>
      </form>
      <form class="sign-up-form">
        <h6 class="form-title">注册</h6>
        <input v-model="nickName" type="text" placeholder="昵称" maxlength="32" />
        <input v-model="account" type="text" placeholder="用户名" maxlength="32" />
        <input v-model="password" type="password" placeholder="密码" maxlength="32" />
        <input v-model="confirmPassword" type="password" placeholder="重复密码" maxlength="32" />
        <div class="verificationCodeInputBox">
          <l-verification-code-input class="verificationCodeInput" :maxLength="6" placeholder="注册码" v-model:value="registeredCode"></l-verification-code-input>
        </div>
        <div class="submit-btn" @click="registered">立即注册</div>
      </form>
    </div>
    <div class="desc-warp">
      <div class="desc-warp-item sign-up-desc">
        <div class="content">
          <button id="sign-up-btn" @click="switchRgistered()">注册</button>
        </div>
        <img src="../assets/img/log.svg" alt="" />
      </div>
      <div class="desc-warp-item sign-in-desc">
        <div class="content">
          <button id="sign-in-btn" @click="switchLogin()">登录</button>
        </div>
        <img src="../assets/img/register.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import {reactive,toRefs,getCurrentInstance} from "vue"
import lVerificationCodeInput from "../components/lVerificationCodeInput";
// import { storeToRefs } from "pinia";
import {useStore} from "@/store/index.ts"
export default {
  components: {
    lVerificationCodeInput,
  },
  setup() {
    const data = reactive({
      isRegistered: false, //是否是注册页面
      nickName: "",
      account: "",
      password: "",
      confirmPassword: "",
      registeredCode: "",
      rememberMe: false, //记住账号
    })

    const {proxy,appContext} = getCurrentInstance();

    const globalProperties = appContext.config.globalProperties

    const store = useStore();

    const encryption = (str) => {
      //加密
      let num1 = window.btoa(str).replace(/=/g, "··");
      let num2 = window.btoa(num1).replace(/=/g, "s+");
      return num2;
    }
    const decrypt = (str) => {
      //解密
      let num1 = window.atob(str.replace(/s\+/g, "="));
      let num2 = window.atob(num1.replace(/··/g, "="));
      return num2;
    }

    if (localStorage.getItem("account") != null) {
      data.account = decrypt(localStorage.getItem("account"));
    }

    if (localStorage.getItem("password") != null) {
      data.password = decrypt(localStorage.getItem("password"));
    }
    if (data.account && data.password) {
      data.rememberMe = true;
    }

    // store.isLogin = sessionStorage.getItem("isLogin");
    if (store.isLogin) {
      proxy.$router.replace({ name: "drive" }); //已登录直接进入云盘
    }


  const switchRememberMe = ()=> {
      //切换记住我开关
      data.rememberMe = !data.rememberMe;
    };
   const switchLogin = () => {
      //切换到登录
      data.isRegistered = false;
      resetInput();
      const container = document.querySelector(".container");
      container.classList.remove("sign-up-mode");
      document.title = "登录对象云盘";
    }
    const switchRgistered = () => {
      //切换到注册
      data.isRegistered = true;
      resetInput();
      const container = document.querySelector(".container");
      container.classList.add("sign-up-mode");
      document.title = "注册对象云盘";
    }
    const keydown = (e) => {
      if (e.keyCode == 13) {
        if (!data.isRegistered) {
          login();
        } else {
          registered();
        }
      }
    }
    const login = () => {
      //登录
      if (data.account == "" || data.account == null) {

        globalProperties.$tipMessge.open("用户名不能为空");
        return;
      }
      if (data.password == "" || data.password == null) {
        globalProperties.$tipMessge.open("密码不能为空");
        return;
      }

      proxy.$http
        .post(`${store.serve.serveUrl}user/objectCloudDiskLogin`, {
          account: data.account,
          password: data.password,
        })
        .then((res) => {
          if (res.data.code == 200) {
            if (data.rememberMe) {
              localStorage.setItem("account", encryption(data.account));
              localStorage.setItem("password", encryption(data.password));
            } else {
              localStorage.removeItem("account");
              localStorage.removeItem("password");
            }

            // sessionStorage.setItem("isLogin", true);
            // sessionStorage.setItem("id", res.data.data.id);
            // sessionStorage.setItem("photo", res.data.data.photo);
            // sessionStorage.setItem("nickname", res.data.data.nickName);

            store.isLogin = true;
            store.id = res.data.data.id;
            store.photo = res.data.data.photo;
            store.nickname = res.data.data.nickName;
            proxy.$router.push({ name: "drive" });
          } else {
            proxy.$tipMessge(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err)
          // globalProperties.$tipMessge.open(err.data.message);
        });
    }
    const registered= () => {
      //注册
      if (data.nickName == "") {
        globalProperties.$tipMessge.open("昵称不能为空");
        return;
      }
      if (data.account == "") {
        globalProperties.$tipMessge.open("用户名不能为空");
        return;
      }
      if (data.password == "") {
        globalProperties.$tipMessge.open("密码不能为空");
        return;
      }
      if (data.confirmPassword == "") {
        globalProperties.$tipMessge.open("确认密码不能为空");
        return;
      }
      if (data.registeredCode == "") {
        globalProperties.$tipMessge.open("注册码不能为空");
        return;
      }
      proxy.$http
        .post(
          `${store.serve.serveUrl}user/objectCloudDiskRegistered`,
          {
            nickName: data.nickName,
            account: data.account,
            password: data.password,
            confirmPassword: data.confirmPassword,
            registeredCode: data.registeredCode,
          }
        )
        .then((res) => {
          if (res.data.code == 200) {
            // this.$router.push({ name: "login" });
            switchLogin();
          }
          globalProperties.$tipMessge.open(res.data.message);
        })
        .catch((err) => {
          console.log(err)
          globalProperties.$tipMessge.open(err.data.message);
        });
    }
    const resetInput = () => {
      //重置所有输入
      data.nickName = "";
      data.account = "";
      data.password = "";
      data.confirmPassword = "";
      data.registeredCode = "";
    }
  

    return {
      ...toRefs(data),
      store,
      switchRememberMe,
      switchLogin,
      switchRgistered,
      keydown,
      login,
      registered,
      resetInput,
      encryption,
      decrypt
    }
  },
};
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}
.container::before {
  content: " ";
  position: absolute;
  width: 2000px;
  height: 2000px;
  border-radius: 50%;
  background-image: linear-gradient(-45deg, #6266f5 10%, #04befe 100%);
  transition: 1.8s ease-in-out;
  z-index: 6;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
}
.container.sign-up-mode::before {
  transform: translate(100%, -50%);
}

.form-warp {
  width: 50%;
  position: absolute;
  z-index: 5;
  left: 75%;
  top: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 1fr;
  transition: 1s 0.7s ease-in-out;
}
.form-warp form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  /* 将两个 form 布局在 grid 同一位置 */
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  transition: all 0.2s 0.7s;
  opacity: 1;
  z-index: 4;
}
.form-title {
  font-size: 24px;
  color: #6266f5;
}
.form-warp .sign-up-form {
  opacity: 0;
  z-index: 3;
}
.container.sign-up-mode .form-warp {
  left: 25%;
}
.container.sign-up-mode .sign-in-form {
  opacity: 0;
  z-index: 3;
}
.container.sign-up-mode .sign-up-form {
  opacity: 1;
  z-index: 4;
}
input,
.submit-btn {
  min-width: 300px;
  outline: none;
  padding: 12px 30px;
  line-height: 1;
  font-size: 16px;
  border-radius: 60px;
  color: #333;
  background-color: #6267f513;
  border: none;
}
input::placeholder {
  color: #cccc;
}
.submit-btn {
  background-color: #6266f5;
  color: #fff;
  text-align: center;
  min-width: 150px;
  font-size: initial;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
}

.desc-warp {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  user-select: none;
}
.desc-warp-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  padding: 0rem 17% 0rem 12%;
  z-index: 6;
}
/* 事件穿透 BEGIN */
.sign-in-desc {
  pointer-events: none;
}
.sign-up-mode .sign-in-desc {
  pointer-events: all;
}
.sign-up-mode .sign-up-desc {
  pointer-events: none;
}
/* 事件穿透 END */
.content {
  width: 100%;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}
.sign-in-desc img,
.sign-in-desc .content {
  transform: translateX(800px);
}
.sign-up-mode .sign-in-desc img,
.sign-up-mode .sign-in-desc .content {
  transform: translateX(0);
}

.sign-up-mode .sign-up-desc img,
.sign-up-mode .sign-up-desc .content {
  transform: translateX(-800px);
}

button {
  outline: none;
  padding: 6px 8px;
  min-width: 100px;
  text-align: center;
  border-radius: 30px;
  border: 2px solid #fff;
  background: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}
button:active {
  background: rgba(255, 255, 255, 0.1);
}
img {
  width: 100%;
  display: block;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.5s;
}

/* 开关 */
.rememberMeBox {
  display: flex;
  align-items: center;
  margin: 0 0.2rem 0.2rem;
}

.rememberMeBoxLabel {
  font-size: 0.14rem;
  margin-right: 0.2rem;
}

.switchBox {
  border-radius: 20px;
  border: 2px solid #6266f5;
  width: 40px;
  height: 20px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: ease-in 0.2s;
  cursor: pointer;
  box-sizing: content-box;
}

.switchBoxOn {
  background-color: #6266f5 !important;
}

.switch {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(0%);
  background-color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 25px;
  box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1),
    0 3px 3px 0 rgba(0, 0, 0, 0.05);
  transition: ease-in 0.2s;
}

.switchOn {
  transform: translateX(100%) !important;
}

.verificationCodeInputBox {
  display: flex;
  flex-direction: column;
  margin: 0 0.2rem 0.2rem;
}

.verificationCodeInputBox label {
  font-size: 0.14rem;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 0 0 0.2rem 0;
}

/* 响应式 */
@media screen and (max-width: 870px) {
  .container::before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }
  .container.sign-up-mode::before {
    transform: translate(-50%, 100%);
    bottom: 24%;
    right: initial;
  }
  .form-warp {
    width: 100%;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }
  .container.sign-up-mode .form-warp {
    top: 5%;
    left: 50%;
    transform: translate(-50%, 0);
  }
  img {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.7s;
  }
  .desc-warp {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }
  .desc-warp-item {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0vh 8%;
    grid-column: 1 / 2;
  }
  .sign-in-desc {
    grid-row: 3 / 4;
  }

  .sign-in-desc img,
  .sign-in-desc .content {
    transform: translateY(800px);
  }

  .sign-up-mode .sign-in-desc img,
  .sign-up-mode .sign-in-desc .content {
    transform: translateY(0);
  }

  .sign-up-mode .sign-up-desc img,
  .sign-up-mode .sign-up-desc .content {
    transform: translateY(-800px);
  }
}

@media screen and (max-width: 570px) {
  .container::before {
    bottom: 72%;
    left: 50%;
  }
  img {
    display: none;
  }
}
</style>

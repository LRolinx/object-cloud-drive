<!--
 * @Author: LRolinx
 * @Date: 2021-01-17 22:02:24
 * @LastEditTime: 2021-01-19 21:57:51
 * @Description: L验证码输入组件
 * 
-->
<template>
  <div class="componentBody">
    <div class="verificationCodeInputBox">
      <input class="codeInput" ref="codeInput" v-model="inputValue" :maxlength="maxLength" :placeholder="placeholder" @blur="blurInput" @keydown="keyDown" />
      <div class="inputItem" :class="{focus:index==inputValue.length&isInput}" v-for="(item,index) in maxLength" :key="index" @click="clickInput">{{getThisValue(index)}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    maxLength: {
      type: Number,
      default: 6
    },
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  },
  watch: {
    inputValue(newNum) {
      this.$emit("update:value", newNum)
    }
  },
  data() {
    return {
      isInput: false,
      inputIndex: 0,
      inputValue: "",
    }
  },
  computed: {
    getThisValue: function () {
      //返回对应位置的字符串
      return function (index) {
        return this.inputValue.substring(index, index + 1);
      }
    }
  },
  methods: {
    clickInput() {
      //点击输入框
      this.isInput = true;
      this.$refs.codeInput.focus();
    },
    blurInput() {
      //聚焦取消
      this.isInput = false;
    },
    keyDown(e) {
      //屏蔽部分按键
      if (e.keyCode == 37) {
        //左键
        e.returnValue = false;
      }
      if (e.keyCode == 38) {
        //上键
        e.returnValue = false;
      }
      if (e.keyCode == 39) {
        //右键
        e.returnValue = false;
      }
      if (e.keyCode == 40) {
        //下键
        e.returnValue = false;
      }
    }
  }
}
</script>
<style scoped>
.codeInput {
  /* width: 0;
  height: 0; */
  border: none;
  position: absolute;
  left: -3000rem;
  /* color: rgba(0, 0, 0, 0); */
}

.verificationCodeInputBox {
  display: flex;
  position: relative;
}

.inputItem {
  width: 0.4rem;
  height: 0.4rem;
  background-color: #f2f6ff;
  border: 0.02rem solid #758bbd;
  border-radius: 1rem;
  margin: 0 0.05rem;
  cursor: text;
  font-size: 0.24rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.focus {
  box-shadow: 0 0 0.1rem #758bbd;
  position: relative;
}

.focus::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 60%;
  width: 0.02rem;
  background-color: #758bbd;
  transform: translate(-50%, -50%);
  animation: ease-in infinite 0.8s focus;
}

@keyframes focus {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 750px) {
  .codeInput {
    position: inherit;
    left: inherit;
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

  .inputItem {
    display: none;
  }
}
</style>
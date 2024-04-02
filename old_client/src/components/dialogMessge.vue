<!--
 * @Author: LRolinx
 * @Date: 2021-01-24 17:44:47
 * @LastEditTime 2021-12-15 12:14
 * @Description: 确定模态窗
 * 
-->
<template>
  <div class="componentBody">
    <div class="mask">

    </div>
    <div class="contentBox">
      <p>{{title}}</p>
      <span>{{text}}</span>
      <div class="btn-box">
        <button class="left-btn" @click="cancel">{{ left_buttton }}</button>
        <button class="right-btn" @click="ok">{{ right_buttton }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "tipMessge",
  data() {
    return {
      // tip提示 warn警告 err错误 succ成功
      type: "tip",
      title: "提示",
      text: "你好，世界",
      left_buttton: "取消",
      right_buttton: "确定",
    };
  },
  methods: {
    //点击取消按钮
    cancel() {
      this.onCancel(); //点击取消的回调函数
      this.$destroy(true); //销毁组件
      this.$el.parentNode.removeChild(this.$el); //父元素中移除dom元素（$el为组件实例）
    },
    //点击确定按钮
    ok() {
      this.onOk(); //点击确定的回调函数
      this.$destroy(true); //销毁组件
      this.$el.parentNode.removeChild(this.$el); //父元素中移除dom元素（$el为组件实例）
    },
  },
};
</script>
<style scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  animation: linear 0.2s forwards animaMask;
  /* background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px); */
}

@keyframes animaMask {
  0% {
    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0px);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }
}

.contentBox {
  position: fixed;
  left: 50%;
  top: 0rem;
  z-index: 999;
  border-radius: 0.2rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  width: 3rem;
  animation: ease-in 2s forwards contentBox;
  box-shadow: 0 0 8px #ddd;
}

.btn-box {
  padding: 0.2rem 0;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  justify-content: space-around;
}

button {
  width: 35%;
  height: 38px;
  font-size: 16px;
  border-radius: 0.1rem;
  border: none;
  outline: none;
  cursor: pointer;
  /* flex: 1; */
}

.left-btn {
  background-color: #dcdfe6;
  color: #606266;
}

.right-btn {
  background-color: #6266f5;
  color: #fff;
}

@keyframes contentBox {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  10% {
    top: 1.3rem;
  }
  15% {
    top: 1rem;
  }

  100% {
    top: 1rem;
    transform: translate(-50%, -50%) scale(1);
  }
}

.contentBox p {
  font-size: 0.18rem;
  padding: 0.2rem;
  font-weight: bold;
}

.contentBox span {
  font-size: 0.14rem;
  padding: 0 0.2rem;
}
</style>
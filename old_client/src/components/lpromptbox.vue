<!--
 * @Author: LRolinx
 * @Date: 2020-10-24 15:49:08
 * @LastEditTime: 2020-11-28 21:37:09
 * @Description: L提示框
 * 
-->
<template>
  <div class="body" :class="{ show: show}">
    <div class="promptBox">
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: "稍等一下哦~",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.body {
  display: flex;
  position: fixed;
  top: 0;
  opacity: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 999;
}

.promptBox {
  max-width: 4rem;
  font-size: 0.16rem;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 0 20px #ddd;
  border-radius: 0.1rem;
  overflow: hidden;
  display: flex;
  font-weight: bold;
  user-select: none;
}

.promptBox span {
  padding: 0.1rem 0.2rem;
}

.show {
  animation: ease-out forwards 2s show;
}

@keyframes show {
  0% {
    top: 0%;
    opacity: 0;
  }
  20% {
    top: 15%;
    opacity: 1;
  }
  80% {
    top: 15%;
    opacity: 1;
  }
  100% {
    top: 0%;
    opacity: 0;
  }
}
</style>
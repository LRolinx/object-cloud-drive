<!--
 * @Author: LRolinx
 * @Date: 2020-10-24 11:36:19
 * @LastEditTime: 2021-01-06 23:31:09
 * @Description: L滚动条组件
 * 
-->
<template>
  <div class="scrollbody" ref="scrollbody" @mousewheel="lmousewheel" @mousemove="lmousemove" :style="{ overflow: !notOpenMovenNatural ? 'auto' : 'hidden' }">
    <div class="scrollBox">
      <div class="scrollContent" :style="{
          transform: `translate3d(0,-` + mousetop + `px,0)`,
        }">
        <!-- 你的内容 -->
        <slot> </slot>
        <!-- 内容结束 -->
      </div>
    </div>
    <!-- 滚动条 -->
    <div class="scrollBarBox" v-show="showScrollBar && notOpenMovenNatural">
      <div class="scrollBar" ref="scrollBar" :style="{ top: `${scrollBarTop}px` }"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mousetop: 0,
      scrollBarTop: 0,
      notOpenMovenNatural: false,
      showScrollBar: false,
    };
  },
  mounted() {
    this.notOpenMovenNatural = this.isPc();
    addEventListener("resize", this.scrollResize);
  },
  unmounted() {
    //离开事件
    removeEventListener("resize",this.scrollResize);
  },
  methods: {
    scrollResize() {
      //监听浏览器屏幕变化
      // console.log(res);
      this.notOpenMovenNatural = this.isPc();
      this.lbacktop();
      if (
        this.$refs.scrollbody.offsetHeight < this.$refs.scrollbody.scrollHeight
      ) {
        this.showScrollBar = true;
      } else {
        this.showScrollBar = false;
      }
    },
    lbacktop() {
      //回到顶部
      this.mousetop = 0;
      this.scrollBarTop = 0;
      if (this.$refs != null || this.$refs != undefined || this.$refs != "") {
        this.$refs.scrollbody.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    },
    scrollBarCalculation() {
      //滚动条计算
      this.scrollBarTop =
        this.mousetop /
        ((this.$refs.scrollbody.scrollHeight -
          this.$refs.scrollbody.offsetHeight) /
          (this.$refs.scrollbody.offsetHeight -
            this.$refs.scrollBar.offsetHeight));
    },
    isPc() {
      //判断是否是PC端
      let userAgent = navigator.userAgent.toLowerCase();
      let phone = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|miuibrowser|mobile safari/;//正则表达式
      if (phone.test(userAgent)) {
        return false;
      } else {
        return true;
      }
    },
    lmousemove() {
      //鼠标移动
      if (
        this.$refs.scrollbody.offsetHeight < this.$refs.scrollbody.scrollHeight
      ) {
        this.showScrollBar = true;
      } else {
        this.showScrollBar = false;
      }
    },
    lmousewheel(e) {
      if (
        this.$refs.scrollbody.offsetHeight < this.$refs.scrollbody.scrollHeight && this.notOpenMovenNatural
      ) {
        if (
          this.mousetop + e.deltaY < -1 ||
          this.mousetop + e.deltaY >
          this.$refs.scrollbody.scrollHeight -
          this.$refs.scrollbody.offsetHeight +
          1
        ) {
          //这里初略判断滚动是否到顶部或者到底部
          if (this.mousetop + e.deltaY < -1 && this.mousetop >= 1) {
            //二次判断是否真到顶部
            this.mousetop = 0;
            this.scrollBarCalculation();
            return;
          }

          if (
            this.mousetop + e.deltaY >
            this.$refs.scrollbody.scrollHeight -
            this.$refs.scrollbody.offsetHeight +
            1 &&
            this.mousetop <=
            this.$refs.scrollbody.scrollHeight -
            this.$refs.scrollbody.offsetHeight -
            1
          ) {
            //二次判断是否真到底部
            this.mousetop =
              this.$refs.scrollbody.scrollHeight -
              this.$refs.scrollbody.offsetHeight;
            this.scrollBarCalculation();
            return;
          }
          this.scrollBarCalculation();
          return;
        }
        this.mousetop += e.deltaY;
        this.scrollBarCalculation();
      }
    },
  },
};
</script>
<style scoped>
.scrollbody {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scrollbody:hover .scrollBarBox,
.scrollbody:hover .scrollBarBox .scrollBar {
  background: rgba(0, 0, 0, 0.1);
}

.scrollBarBox {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: rgba(0, 0, 0, 0);
  transition: all ease-out 0.6s;
  border-radius: 100px;
}

.scrollBar {
  position: absolute;
  left: 0;
  top: 0px;
  height: 100px;
  width: 4px;
  background: rgba(0, 0, 0, 0);
  transition: all ease-out 0.6s;
  border-radius: 100px;
}

.scrollContent {
  transform: translate3d(0, 0px, 0);
  transition: all ease-out 0.6s;
}
</style>
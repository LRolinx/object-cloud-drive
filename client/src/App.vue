<!--
 * @Author: LRolinx
 * @Date: 2020-10-14 20:58:01
 * @LastEditTime: 2021-01-22 17:43:52
 * @Description: 
 * 
-->
<template>
  <div id="app" @dragenter.prevent="noDrag" @dragover.prevent="noDrag">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>

export default {
  name: "App",
  methods: {
    noDrag(e) {
      //禁止拖拽
      e.dataTransfer.dropEffect = 'none';
    }
  },
  created() {
    // this.$store.dispatch("setAll");
  }
};
</script>

<style>
/* chrome 和Safari隐藏滚动条 */
*::-webkit-scrollbar {
  width: 0 !important;
}

* {
  /* IE 10+ 隐藏滚动条 */
  -ms-overflow-style: none;
  /* Firefox 隐藏滚动条 */
  overflow: -moz-scrollbars-none;
  /* 取消掉移动端的点击产生的蓝色背景 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* 文字选择颜色 */
*::selection {
  background-color: #555;
  color: #fff;
}

#app {
  /* 开启硬件加速 */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}

html {
  font-size: 100px;
}

body {
  margin: 0;
  padding: 0;
  background: #fff;
  /* background: #f2f6ff; */
  color: #555;
  /* background-image: url("https://cn.bing.com/th?id=OHR.SnowCraterLake_ZH-CN9218350129_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"); */
}

a {
  text-decoration: none;
  text-decoration-color: #555;
  color: #555;
}

p {
  margin: 0;
}

li {
  list-style: none;
}
</style>

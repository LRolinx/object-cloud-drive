<!--
 * @Author: LRolinx
 * @Date: 2021-01-06 10:18:47
 * @LastEditTime: 2021-01-20 18:54:52
 * @Description: 我的云盘-资源池
 * 
-->
<template>
  <div class="body">
    <p style="font-size:0.24rem">资源池</p>
  </div>
</template>
<script>
import { getCurrentInstance } from "vue";
import { useStore } from "@/store/index.ts";
export default {
  created() {

    const store = useStore();
    const { appContext } = getCurrentInstance();
    const globalProperties = appContext.config.globalProperties;

    if (!store.isLogin) {
      globalProperties.$router.replace({ name: 'login' });//没登录直接回到登录页
    }
  },
}
</script>
<style scoped>
.body {
  /* width: 100vw; */
}
</style>
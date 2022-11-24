<!--
 * @Author: LRolinx
 * @Date: 2021-01-09 13:37:25
 * @LastEditTime 2021-12-16 11:36
 * @Description: 流视频DEMO
 * 
-->
<template>
  <div class="bodyBox">
    <button type="button" @click="show">显示视频模态窗</button>
    <div>

    </div>
    <!-- <video id="DEMO" controls></video> -->
    <lVideo :videoList="videoList" v-model:isShow="isShow"></lVideo>
    <!-- <video class="video" :src="`${$store.state.serve.serveUrl}video/playVideo?name=59b615ae720a9912661f22d4608db65dc6d5a576bf3d9f95296ec25002efd06a.mp4`" controls></video> -->
    <!-- <video width="100%" class="video" id="video" ref="video" :src="lsSrc" controls @loadedmetadata="destroyBlobUrl(lsSrc)"></video> -->
  </div>
</template>
<script>
import { toRefs,getCurrentInstance } from "vue";
import { useStore } from "@/store/index.ts";
import lVideo from "@/components/lVideo";
export default {
  components: {
    lVideo,
  },
  created() {
    const data = {
      isShow: false,
      videoList: [],
      lsSrc: "",
    }

    const store = useStore();
    const { appContext } = getCurrentInstance();
    const globalProperties = appContext.config.globalProperties;

    if (!store.isLogin) {
      globalProperties.$router.replace({ name: 'login' });//没登录直接回到登录页
    }

    data.videoList.push(
      "m2+c7R+kU2IF4Kn8v9c/kCJqZGx5f2Ioj3XOX6HxXjTg7X1gXnTXMz9C4lTvk7ql4m39H6UXqdcKF8SbUzI5VU0ronOI+aYmYMRglsAVGWawtXD41vrJEfonMiM3fdD9+ehR+LDcjfAuPYc/aoAbzJcxnBBkwD7YKyvPB+hrvDA="
    );

    // this.$http.post(`${this.$store.state.serve.serveUrl}video/playVideoSteam`, {
    //   name: "8a8b0118c620cba9363eefe843491322f282a87efa4481a97500dca0bf2a70b2.mp4"
    // },{
    //   responseType:'blob'
    // }).then(res => {
    //   // console.log(res.data);

    //   // let video = document.querySelector("#video");
    //   // video.src = URL.createObjectURL(res.data);
    //   this.videoList.push(
    //   {
    //     title: `测试他一手`,
    //     src: URL.createObjectURL(res.data),
    //   })
    // }).catch(err => {
    // this.$tipMessge(err.data.message)
    // })

    const show = () => {
      data.isShow = true;
    };

    const destroyBlobUrl = (blob) => {
      //销毁blob地址
      window.URL.revokeObjectURL(blob);
    };


    return {
      ...toRefs(data),
      show,
      destroyBlobUrl
    }
  },
};
</script>
<style scoped>
.bodyBox {
  overflow: auto;
}
/* .video {
  width: 80vw;
} */
</style>
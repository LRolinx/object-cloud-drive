<!--
 * @Author: LRolinx
 * @Date: 2021-01-25 15:02:00
 * @LastEditTime: 2021-01-27 12:57:16
 * @Description: L图片组件
 * 
-->
<template>
  <div class="componentBody" v-if="isShow">
    <div class="mask">
      <div class="pictureBox" @click.stop="">
        <div class="videoHead">
          <p class="videoHeadTitle">测试</p>
          <i class="iconfont icon-file-cancel videoHeadClose"></i>
        </div>
        <div class="pictureContent">
          <img class="picture" src="https://tse4-mm.cn.bing.net/th/id/OIP-C.gPJ41ZwWXgeAo53WpXuUUgAAAA?pid=ImgDet&rs=1" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      define: false
    },
    videoList: {
      type: Array,
      define: []
    }
  },
  data() {
    return {
      index: 0,//当前列表图片索引
      isFull: false,//是否全屏
      isShowFullControll: false,//是否隐藏全屏控制台
      fullSetTime: null,//全屏隐藏控制台计时器
    };
  },
  watch: {
    isShow(newNum) {
      if(newNum){
        this.$nextTick(()=>{
          //这个方法体里是弹窗渲染完成才触发

        })
      }
    },
  },
  mounted() {
  },
  methods: {

  }
};
</script>
<style scoped>

.componentBody {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  user-select: none;
  backdrop-filter:blur(10px);
}

.videoHead {
  color: #fff;
  transition: ease-in 0.2s;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  background:rgba(72,80,97,0.3);
}

.videoHeadTitle {
  font-size: 0.18rem;
  overflow: hidden;
  width: 40%;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* padding: 0.2rem; */
}

.videoHeadClose {
  font-size: 0.24rem;
  /* padding: 0.2rem; */
  cursor: pointer;
}

.pictureBox {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: rgba(42, 50, 68, 0.8);
  border-radius: 0.2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px #999;
}

.pictureContent {
  display: flex;
  flex-direction: row;
  width: max-content;
  height: max-content;
}

.picture {
  max-width: 80vw;
  max-height: 80vh;
}




@media (max-width: 750px) {
  /* .video {
    width: 30vw;
    padding: 0 0.05rem;
  } */
}
</style>
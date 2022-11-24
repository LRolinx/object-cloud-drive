<!--
 * @Author: LRolinx
 * @Date: 2021-01-25 15:02:00
 * @LastEditTime 2021-12-16 13:07
 * @Description: L视频播放器组件
 * 
-->
<template>
  <div class="componentBody" v-if="props.isShow">
    <!-- <div class="mask">
      <div class="videoBox" :class="{videoBoxFull:isFull}" ref="videoBox" @fullscreenchange="fullscreenchange"
        @click.stop="">
        <div class="videoHead"
          :class="{videoHeadFull:isFull,opCursor:isFull && isShowFullControll,opacityNo:isFull && isShowFullControll}"
          @mousemove="mouseMoveShowControll">
          <p class="videoHeadTitle" v-if="videoList[index]!=null">{{videoList[index].title}}</p>
          <i class="iconfont icon-file-cancel videoHeadClose" v-if="!isFull" @click="closeModel"></i>
        </div>
        <div class="videoContent" :class="{videoContentFull:isFull,opCursor:isFull && isShowFullControll}"
          @dblclick="videoPlayOrPause" @mousemove="mouseMoveShowControll">
          <video ref="video" webkit-playsinline="true" v-if="videoList[index]!=null" class="video" @load="load"
            @loadedmetadata="loadedmetadata" @loadstart="loadstart" @timeupdate="timeupdate" @waiting="waiting"
            @play="play" @pause="pause" @ended="ended" @error="error"></video>
        </div>
        <div class="videoControll"
          :class="{videoControllFull:isFull,opacityNo:isFull && isShowFullControll,opCursor:isFull && isShowFullControll}"
          @mousemove="mouseMoveShowControllAndClear">
          <div class="videoControllHead" ref="progress" @click="clickSchedule">
            <div class="videoControllHeadContent">
              <span class="buffered" style="width:0%"></span>
              <span class="schedule" :style="{width:`${schedule}%`}"></span>
            </div>
          </div>
          <div class="videoControllContent">
            <div class="videoControllContentLeft">
              <i class="iconfont icon-before-one" @click="backPlay"></i>
              <i class="iconfont" :class="{'icon-or-play':!isPlay,'icon-audio-suspend':isPlay}"
                @click="videoPlayOrPause"></i>
              <i class="iconfont icon-next-one" @click="nextPlay"></i>
              <span>{{playTime}} / {{playEndTime}}</span>
            </div>
            <div class="videoControllContentRight">
              <span>倍数</span>
              <i class="iconfont icon-video-volume"></i>
              <i class="iconfont" :class="{'icon-video-screenfull-enter':!isFull,'icon-video-screenfull-exit':isFull}"
                @click.stop="videoFullAndExitFull"></i>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue'

type typeProps = {
  isShow: boolean,
  videoList: string[]
}

const props = defineProps<typeProps>();

const mediaSource = ref(null);//媒体流
const index = ref(0);//当前列表播放视频索引
const isPlay = ref(false);//正在播放
const previous = ref(2);//上一步操作,0 上一视频,1 播放/暂停,2 下一视频
const schedule = ref(0);//视频进度
const playTime = ref('00:00');//正在播放时间
const playEndTime = ref('00:00');//播放结束结束时间
const isFull = ref(false);//是否全屏
const playSetTime = ref(null);//播放防抖
const isShowFullControll = ref(false);//是否隐藏全屏控制台
const fullSetTime = ref(null);//全屏隐藏控制台计时器


// const sourceOpen = () => {
//   destroyBlobUrl($refs.video.src);
//   // 设置 媒体的编码类型
//   //  var mime = 'video/webm; codecs="vorbis,vp8"';
//   const mime = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
//   let sourceBuffer = mediaSource.addSourceBuffer(mime);

//   $http.post(`${$store.state.serve.serveUrl}video/playVideoSteam`, {
//     id: `${videoList[index]}`
//   }, {
//     responseType: 'arraybuffer'
//   }).then(res => {
//     sourceBuffer.addEventListener('updateend', () => {
//       if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
//         console.log("关闭")
//         mediaSource.endOfStream();
//         // 在数据请求完成后，我们需要调用 endOfStream()。它会改变 MediaSource.readyState 为 ended 并且触发 sourceended 事件。
//         $refs.video.play().then(function () { }).catch(function (err) {
//           console.log(err)
//         });
//       } else {
//         console.log(mediaSource.readyState, "没动作？", sourceBuffer.updating)
//       }
//     });
//     console.log(res);
//     sourceBuffer.appendBuffer(res.data);
//   }).catch(err => {
//     console.log(err);
//   })
// };
// const mouseMoveShowControll = () => {
//   //在规定范围移动显示并触发定时隐藏控制台
//   isShowFullControll = false;
//   hideControll();
// }
// const mouseMoveShowControllAndClear = () => {
//   //在规定范围移动显示并清除定时隐藏控制台
//   isShowFullControll = false;
//   if (fullSetTime != null) {
//     clearTimeout(fullSetTime);
//     fullSetTime = null;
//   }
// },
// const hideControll = () => {
//   //隐藏控制台
//   if (fullSetTime != null) {
//     clearTimeout(fullSetTime);
//     fullSetTime = null;
//   }

//   fullSetTime = setTimeout(() => {
//     isShowFullControll = true;
//   }, 1000);
// }
// const videoFullAndExitFull = () => {
//   //进入视频全屏或退出全屏
//   if (!isFull) {
//     if ($refs.videoBox.requestFullscreen) {
//       $refs.videoBox.requestFullscreen();
//     } else if ($refs.videoBox.mozRequestFullScreen) {
//       $refs.videoBox.mozRequestFullScreen();
//     } else if ($refs.videoBox.webkitRequestFullscreen) {
//       $refs.videoBox.webkitRequestFullscreen();
//     } else if ($refs.videoBox.msRequestFullscreen) {
//       $refs.videoBox.msRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullScreen) {
//       document.exitFullScreen();
//     } else if (document.mozCancelFullScreen) {
//       document.mozCancelFullScreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//       document.msExitFullscreen();
//     }
//   }
// }
// const fullscreenchange = () => {
//   //监听屏幕变化
//   isFull = document.mozFullScreen ||
//     document.webkitIsFullScreen ||
//     document.webkitFullScreen ||
//     document.msFullScreen;
// }
// const secondToTime = (value) => {
//   //秒转时间
//   return `${parseInt(value / 60) < 10 ? '0' + parseInt(value / 60) : parseInt(value / 60)
//     }:${parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60)}`
// }
// const backPlay = () => {
//   //上一视频
//   previous = 0;
//   if (index - 1 < 0) {
//     index = videoList.length - 1;
//   } else {
//     index -= 1;
//   }
//   $refs.video.src = videoList[index].src;

//   if (playSetTime != null) {
//     clearTimeout(playSetTime);
//     playSetTime = null;
//   }

//   playSetTime = setTimeout(() => {
//     $refs.video.play();
//   }, 300)
// }
// const videoPlayOrPause = () => {
//   //播放或暂停
//   isPlay = isPlay ? $refs.video.pause() : $refs.video.play();
// }
// const nextPlay = () => {
//   //下一视频
//   previous = 2;
//   if (index + 1 == videoList.length) {
//     index = 0;
//   } else {
//     index += 1;
//   }
//   $refs.video.src = videoList[index].src;


//   if (playSetTime != null) {
//     clearTimeout(playSetTime);
//     playSetTime = null;
//   }

//   playSetTime = setTimeout(() => {
//     $refs.video.play();
//   }, 300)

// }
// const clickSchedule = (e) => {
//   //点击进度
//   if ($refs.video != undefined) {
//     $refs.video.currentTime = (e.offsetX / ($refs.progress.offsetWidth / 100)) * ($refs.video.duration / 100);
//   }
//   updateTime();
// }
// const loadstart = () => {
//   //视频初始化
// }
// const loadedmetadata = () => {
//   //视频加载前触发
//   updateTime();
// }
// const load = () => {
//   // console.log("销毁成功")
//   // //视频加载后触发
//   // destroyBlobUrl($refs.video.src);
// }
// const error = () => {
//   //视频加载错误
//   if (previous == 0) {
//     previous == 2
//     backPlay();
//   }
//   if (previous == 2) {
//     // nextPlay();
//   }
// }
// const waiting = () => {
//   //监听视频缓冲
// }
// const play = () => {
//   //监听视频播放
//   isPlay = true;
// }
// const pause = () => {
//   //监听视频暂停
//   isPlay = false;
// }
// const timeupdate = () => {
//   //监听播放时间变化
//   updateTime();
// }
// const ended = () => {
//   //监听视频结束
//   nextPlay();
// }
// const closeModel = () => {
//   //关闭视频模态窗
//   $emit("update:isShow", false);
// }
// const updateTime = () => {
//   //更新播放的时间以及进度
//   if ($refs.video != undefined) {
//     playTime = secondToTime($refs.video.currentTime);
//     playEndTime = secondToTime($refs.video.duration);
//     schedule = $refs.video.currentTime / ($refs.video.duration / 100);
//   }
// }
// const destroyBlobUrl = (blob) => {
//   //销毁blob地址
//   window.URL.revokeObjectURL(blob);
// }


// /**
//  * 监听
//  */
// watch(computed(() => isShow.value), (v) => {

// })

// watch: {
//   isShow(newNum) {
//     if (newNum) {
//       mediaSource = new MediaSource();
//       $nextTick(() => {
//         //这个方法体里是弹窗渲染完成才触发
//         $refs.video.src = URL.createObjectURL(mediaSource);
//         mediaSource.addEventListener('sourceopen', sourceOpen);
//       })
//     }
//   },
//   isFull(n) {
//     if (n) {
//       hideControll()
//     } else {
//       if (fullSetTime != null) {
//         clearTimeout(fullSetTime);
//         fullSetTime = null;
//       }
//       isShowFullControll = false;
//     }
//   }
// }
// }
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
  backdrop-filter: blur(10px);
}

.videoBox {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: rgba(42, 50, 68, 0.8);
  border-radius: 0.2rem;
  position: relative;
  overflow: hidden;
}

.video {
  width: 80vw;
  max-height: 80vh;
  padding: 0 0.05rem;
}

.video:focus {
  outline: none;
}



.videoHead {
  color: #fff;
  transition: ease-in 0.2s;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  background: rgba(72, 80, 97, 0.3);
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

.videoContent {
  display: flex;
  flex-direction: row;
  width: max-content;
  height: max-content;
}

.videoControll {
  display: flex;
  flex-direction: column;
  transition: ease-in 0.2s;
}

.videoControllHead {
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
  padding: 0.05rem;
}

.videoControllHeadContent {
  height: 0.05rem;
  cursor: pointer;
  position: relative;
  background: rgba(72, 80, 97, 1);
  width: 100%;
}

.buffered {
  background-color: rgba(102, 102, 102, 1);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.schedule {
  background-color: rgba(117, 139, 189, 1);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.videoControllContent {
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
  color: #fff;
  margin: 0.1rem 0 0.2rem;
  padding: 0 0.2rem 0rem;
  justify-content: space-between;
}

.videoControllContentLeft {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.videoControllContentLeft i {
  font-size: 0.2rem;
  cursor: pointer;
  margin-right: 0.1rem;
}

.videoControllContentLeft span {
  font-size: 0.12rem;
  margin-left: 0.1rem;
}

.videoControllContentRight {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.videoControllContentRight i {
  font-size: 0.2rem;
  cursor: pointer;
  margin-left: 0.1rem;
}

.videoControllContentRight span {
  font-size: 0.14rem;
  margin-left: 0.1rem;
  cursor: pointer;
  letter-spacing: 0.01rem;
}

/* 视频全屏 */
.videoBoxFull {
  border-radius: 0rem;
}


.videoHeadFull {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(84, 90, 104, 0));
}

.videoHeadFull p {
  font-size: 0.18rem;
}

.videoControllFull {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
}

.videoContentFull .video {
  padding: 0;
  width: 100vw;
  max-height: inherit;
  height: inherit;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}

.opCursor {
  cursor: none;
}

.opacityNo {
  opacity: 0;
}

@media (max-width: 750px) {
  /* .video {
    width: 30vw;
    padding: 0 0.05rem;
  } */
}
</style>
<!--
 * @Author: LRolinx
 * @Date: 2021-01-25 15:02:00
 * @LastEditTime 2021-12-16 13:07
 * @Description: L视频播放器组件
 * 
-->
<template>
  <div class="componentBody" v-if="isShow">
    <div class="mask">
      <div class="videoBox" :class="{videoBoxFull:isFull}" ref="videoBox" @fullscreenchange="fullscreenchange" @click.stop="">
        <div class="videoHead" :class="{videoHeadFull:isFull,opCursor:isFull && isShowFullControll,opacityNo:isFull && isShowFullControll}" @mousemove="mouseMoveShowControll">
          <p class="videoHeadTitle" v-if="videoList[index]!=null" >{{videoList[index].title}}</p>
          <i class="iconfont icon-file-cancel videoHeadClose" v-if="!isFull" @click="closeModel"></i>
        </div>
        <div class="videoContent" :class="{videoContentFull:isFull,opCursor:isFull && isShowFullControll}" @dblclick="videoPlayOrPause" @mousemove="mouseMoveShowControll">
          <video ref="video" webkit-playsinline="true" v-if="videoList[index]!=null"  class="video" @load="load" @loadedmetadata="loadedmetadata" @loadstart="loadstart" @timeupdate="timeupdate" @waiting="waiting" @play="play" @pause="pause" @ended="ended" @error="error"></video>
        </div>
        <div class="videoControll" :class="{videoControllFull:isFull,opacityNo:isFull && isShowFullControll,opCursor:isFull && isShowFullControll}" @mousemove="mouseMoveShowControllAndClear">
          <div class="videoControllHead" ref="progress" @click="clickSchedule">
            <div class="videoControllHeadContent">
              <span class="buffered" style="width:0%"></span>
              <span class="schedule" :style="{width:`${schedule}%`}"></span>
            </div>
          </div>
          <div class="videoControllContent">
            <div class="videoControllContentLeft">
              <i class="iconfont icon-before-one" @click="backPlay"></i>
              <i class="iconfont" :class="{'icon-or-play':!isPlay,'icon-audio-suspend':isPlay}" @click="videoPlayOrPause"></i>
              <i class="iconfont icon-next-one" @click="nextPlay"></i>
              <span>{{playTime}} / {{playEndTime}}</span>
            </div>
            <div class="videoControllContentRight">
              <span>倍数</span>
              <i class="iconfont icon-video-volume"></i>
              <i class="iconfont" :class="{'icon-video-screenfull-enter':!isFull,'icon-video-screenfull-exit':isFull}" @click.stop="videoFullAndExitFull"></i>
            </div>
          </div>
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
      mediaSource:null,//媒体流
      index: 0,//当前列表播放视频索引
      isPlay: false,//正在播放
      previous: 2,//上一步操作,0 上一视频,1 播放/暂停,2 下一视频
      schedule: 0,//视频进度
      playTime: '00:00',//正在播放时间
      playEndTime: '00:00',//播放结束结束时间
      isFull: false,//是否全屏
      playSetTime: null,//播放防抖

      isShowFullControll: false,//是否隐藏全屏控制台
      fullSetTime: null,//全屏隐藏控制台计时器
    };
  },
  watch: {
    isShow(newNum) {
      if(newNum){
        this.mediaSource = new MediaSource();
        this.$nextTick(()=>{
          //这个方法体里是弹窗渲染完成才触发
          this.$refs.video.src = URL.createObjectURL(this.mediaSource);
          this.mediaSource.addEventListener('sourceopen', this.sourceOpen);
        })
      }
    },
    isFull(n) {
      if (n) {
        this.hideControll()
      } else {
        if (this.fullSetTime != null) {
          clearTimeout(this.fullSetTime);
          this.fullSetTime = null;
        }
        this.isShowFullControll = false; 
      }
    }
  },
  mounted() {
  },
  methods: {

  sourceOpen() {
    this.destroyBlobUrl(this.$refs.video.src);
    // 设置 媒体的编码类型
  //  var mime = 'video/webm; codecs="vorbis,vp8"';
   const mime = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
   let sourceBuffer = this.mediaSource.addSourceBuffer(mime);

   this.$http.post(`${this.$store.state.serve.serveUrl}video/playVideoSteam`, {
      id: `${this.videoList[this.index]}`
    },{
      responseType:'arraybuffer'
    }).then(res => {
      sourceBuffer.addEventListener('updateend', ()=> {
                            if (!sourceBuffer.updating && this.mediaSource.readyState === 'open') {
                              console.log("关闭")
                                this.mediaSource.endOfStream();
                                // 在数据请求完成后，我们需要调用 endOfStream()。它会改变 MediaSource.readyState 为 ended 并且触发 sourceended 事件。
                                this.$refs.video.play().then(function() {}).catch(function(err) {
                                    console.log(err)
                                });
                            }else {
                              console.log(this.mediaSource.readyState,"没动作？",sourceBuffer.updating)
                            }
                        });
                        console.log(res);
      sourceBuffer.appendBuffer(res.data);
    }).catch(err => {
      console.log(err);
    })
  },
    mouseMoveShowControll() {
      //在规定范围移动显示并触发定时隐藏控制台
      this.isShowFullControll = false;
      this.hideControll();
    },
    mouseMoveShowControllAndClear() {
      //在规定范围移动显示并清除定时隐藏控制台
      this.isShowFullControll = false;
      if (this.fullSetTime != null) {
        clearTimeout(this.fullSetTime);
        this.fullSetTime = null;
      }
    },
    hideControll() {
      //隐藏控制台
      if (this.fullSetTime != null) {
        clearTimeout(this.fullSetTime);
        this.fullSetTime = null;
      }

      this.fullSetTime = setTimeout(() => {
        this.isShowFullControll = true;
      }, 1000);
    },
    videoFullAndExitFull() {
      //进入视频全屏或退出全屏
      if (!this.isFull) {
        if (this.$refs.videoBox.requestFullscreen) {
          this.$refs.videoBox.requestFullscreen();
        } else if (this.$refs.videoBox.mozRequestFullScreen) {
          this.$refs.videoBox.mozRequestFullScreen();
        } else if (this.$refs.videoBox.webkitRequestFullscreen) {
          this.$refs.videoBox.webkitRequestFullscreen();
        } else if (this.$refs.videoBox.msRequestFullscreen) {
          this.$refs.videoBox.msRequestFullscreen();
        }
      } else {
        if (document.exitFullScreen) {
          document.exitFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    fullscreenchange() {
      //监听屏幕变化
      this.isFull = document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen;
    },
    secondToTime(value) {
      //秒转时间
      return `${parseInt(value / 60) < 10 ? '0' + parseInt(value / 60) : parseInt(value / 60)
        }:${parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60)}`
    },
    backPlay() {
      //上一视频
      this.previous = 0;
      if (this.index - 1 < 0) {
        this.index = this.videoList.length - 1;
      } else {
        this.index -= 1;
      }
      this.$refs.video.src = this.videoList[this.index].src;

      if (this.playSetTime != null) {
        clearTimeout(this.playSetTime);
        this.playSetTime = null;
      }

      this.playSetTime = setTimeout(() => {
        this.$refs.video.play();
      }, 300)
    },
    videoPlayOrPause() {
      //播放或暂停
      this.isPlay = this.isPlay ? this.$refs.video.pause() : this.$refs.video.play();
    },
    nextPlay() {
      //下一视频
      this.previous = 2;
      if (this.index + 1 == this.videoList.length) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      this.$refs.video.src = this.videoList[this.index].src;


      if (this.playSetTime != null) {
        clearTimeout(this.playSetTime);
        this.playSetTime = null;
      }

      this.playSetTime = setTimeout(() => {
        this.$refs.video.play();
      }, 300)

    },
    clickSchedule(e) {
      //点击进度
      if(this.$refs.video != undefined) {
        this.$refs.video.currentTime = (e.offsetX / (this.$refs.progress.offsetWidth / 100)) * (this.$refs.video.duration / 100);
      }
      this.updateTime();
    },
    loadstart() {
      //视频初始化
    },
    loadedmetadata() {
      //视频加载前触发
      this.updateTime();
    },
    load() {
      // console.log("销毁成功")
      // //视频加载后触发
      // this.destroyBlobUrl(this.$refs.video.src);
    },
    error() {
      //视频加载错误
      if (this.previous == 0) {
        this.previous == 2
        this.backPlay();
      }
      if (this.previous == 2) {
        // this.nextPlay();
      }
    },
    waiting() {
      //监听视频缓冲
    },
    play() {
      //监听视频播放
      this.isPlay = true;
    },
    pause() {
      //监听视频暂停
      this.isPlay = false;
    },
    timeupdate() {
      //监听播放时间变化
      this.updateTime();
    },
    ended() {
      //监听视频结束
      this.nextPlay();
    },
    closeModel() {
      //关闭视频模态窗
      this.$emit("update:isShow", false);
    },
    updateTime() {
      //更新播放的时间以及进度
      if(this.$refs.video != undefined) {
        this.playTime = this.secondToTime(this.$refs.video.currentTime);
        this.playEndTime = this.secondToTime(this.$refs.video.duration);
        this.schedule = this.$refs.video.currentTime / (this.$refs.video.duration / 100);
      }
    },
    destroyBlobUrl(blob) {
      //销毁blob地址
      window.URL.revokeObjectURL(blob);
    },
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
  background: rgba(72,80,97,1);
  width: 100%;
}

.buffered {
  background-color: rgba(102, 102, 102,1);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.schedule {
  background-color: rgba(117, 139, 189,1);
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
  background: linear-gradient(180deg, rgba(0, 0, 0,0.5), rgba(84, 90, 104, 0));
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
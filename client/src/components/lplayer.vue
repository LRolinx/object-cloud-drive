<!--
 * @Author: LRolinx
 * @Date: 2020-10-23 08:48:44
 * @LastEditTime: 2021-01-25 15:02:16
 * @Description: L音乐播放器组件
 * 
-->
<template>
  <div class="body">
    <div class="musicBox">
      <div class="musicBoxTop">
        <div class="musicImg" title="播放列表开关" @click="openOrCloseSongList">
          <img :src="songList[index].pic" :class="{ playAnima: isPlay }" draggable="false" />
        </div>
        <div class="musicContollBox">
          <div class="musicTitle">
            <p :title="songList[index].title + `-` + songList[index].author">
              {{ songList[index].title + `-` + songList[index].author }}
            </p>
          </div>
          <div class="musicContoll">
            <div class="musicContollLeft">
              <i title="上一首" class="cnrIcon-chevrons-left" @click="backPlay"></i>
              <i title="播放开关" :class="{ 'cnrIcon-pause': isPlay, 'cnrIcon-play': !isPlay }" @click="play"></i>
              <i title="下一首" class="cnrIcon-chevrons-right" @click="nextPlay"></i>
            </div>
            <div class="musicContollRight">
              <i  @click="openOrCloselrc" title="歌词开关" :class="{ lrcCheck: isLrc }">词</i>
            </div>
          </div>
        </div>
      </div>
      <div class="musicBoxBottom" ref="progress" @click="clickSchedule">
        <span :style="{ width: schedule + `%` }"></span>
      </div>

      <div class="songList" :style="{ height: isSongList ? '50vh' : '0' }">
        <lscrollbar>
          <div class="songListContent" v-for="(sitem, sindex) in songList" :key="sindex" :class="{ lrcCheck: sindex == index }" @click="selectSong(sindex)">
            <p>{{ sitem.title }}</p>
            <p>{{ sitem.author }}</p>
          </div>
        </lscrollbar>
      </div>
    </div>
    <l-Prompt-Box :show="show" :text="text"></l-Prompt-Box>
  </div>
</template>
<script>
import lscrollbar from "./lscrollbar.vue";
export default {
  components: {
    lscrollbar,
  },
  props: {
    apiList: {
      type: Object,
      define: {
        qqMusicId: "",
        wyMusicId: "",
      },
    },
    musicImg: {
      type: String,
      define: "",
    },
    songList: {
      type: Array,
      define: [
        {
          author: "无歌手",
          lrc: "",
          pic: "",
          title: "无标题",
          url: "",
        },
      ],
    },
  },
  data() {
    return {
      show: false,
      text: "",
      time: null,
      isPlay: false, //正在播放
      isLrc: false, //打开歌词
      isSongList: false, //打开歌曲列表
      schedule: 0,
      audio: null,
      index: 0,
      previous: 2//上一步操作,0 上一首,1 播放/暂停,2 下一首
    };
  },
  mounted() {
    this.audio = new Audio();
    this.audio.addEventListener(`play`, this.onplayf);
    this.audio.addEventListener("timeupdate", this.ontimeupdatef);
    this.audio.addEventListener("pause", this.onpausef);
    this.audio.addEventListener("ended", this.ononendedf);
    this.audio.addEventListener("loadstart", this.onloadstartf);
    this.audio.addEventListener("error", this.onerror);
  },
  methods: {
    backPlay() {
      //上一首
      this.previous = 0;
      if (this.index - 1 < 0) {
        this.index = this.songList.length - 1;
      } else {
        this.index -= 1;
      }
      this.audio.src = this.songList[this.index].url;
      this.audio.play();
    },
    play() {
      //播放
      if (this.audio.src == "") {
        this.audio.src = this.songList[this.index].url;
      }
      this.isPlay = this.isPlay ? this.audio.pause() : this.audio.play();
    },
    nextPlay() {
      //下一首
      this.previous = 2;
      if (this.index + 1 == this.songList.length) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      this.audio.src = this.songList[this.index].url;
      this.audio.play();
    },
    openOrCloseSongList() {
      //打开或关闭歌曲列表
      this.isSongList = !this.isSongList;
    },
    selectSong(index) {
      //选择歌曲
      this.index = index;
      this.audio.src = this.songList[this.index].url;
      this.audio.play();
    },
    openOrCloselrc() {
      //打开或关闭歌词
      if (this.time != null) {
        clearTimeout(this.time);
        this.time = null;
      }
      this.show = true;
      this.text = "这个还在搞，等通知吧";
      this.time = setTimeout(() => {
        this.show = false;
      }, 2000);


      // this.isLrc = !this.isLrc;

    },
    clickSchedule(e) {
      //点击进度
      this.audio.currentTime =
        (e.offsetX / (this.$refs.progress.offsetWidth / 100)) *
        (this.audio.duration / 100);
    },
    onloadstartf() {
      //监听音频加载
      this.$emit("update:musicImg", this.songList[this.index].pic);
    },
    onerror() {
      //音频加载错误
      if (this.previous == 0) {
        this.previous == 2
        this.backPlay();
      }
      if (this.previous == 2) {
        this.nextPlay();
      }
    },
    onplayf() {
      //监听播放
      this.isPlay = true;
    },
    onpausef() {
      //监听暂停
      this.isPlay = false;
    },
    ontimeupdatef() {
      //监听播放位置改变,做进度或者歌词
      this.schedule = this.audio.currentTime / (this.audio.duration / 100);
    },
    ononendedf() {
      //监听播放结束
      this.nextPlay();
    },
  },
};
</script>
<style scoped>
.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.songList {
  min-width: 2.6rem;
  max-height: 50vh;
  background: #fff;
  position: fixed;
  top: 1.15rem;
  border-radius: 0.1rem;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 99;
  transition: ease-out 0.2s;
}

.songListContent {
  display: flex;
  justify-content: space-between;
  font-size: 0.12rem;
  cursor: pointer;
}

.songListContent p {
  margin: 0.08rem;
  user-select: none;
}

.songListContent:active {
  background: rgb(248, 248, 248);
}

.songListContent p:first-child {
  max-width: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.songListContent p:last-child {
  max-width: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicImg {
  border-radius: 1rem;
  overflow: hidden;
  /* padding: 0.3rem; */
  position: relative;
  cursor: pointer;
  width: 0.4rem;
  height: 0.4rem;
}

.musicImg img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  user-select: none;
}

.musicBox {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 0.1rem;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.05);
  margin: 0 0.2rem;
  overflow: hidden;
  min-width: 2.6rem;
}

.musicBoxTop {
  display: flex;
  padding: 0.1rem;
  align-items: center;
}

.musicBoxBottom {
  display: flex;
  height: 0.03rem;
  cursor: pointer;
}

.musicBoxBottom span {
  height: 100%;
  /* -webkit-linear-gradient(45deg,red,#f90,#fc0,#6c0,#0fc) */
  background: linear-gradient(90deg, #53afff, #0059ff);
}

.lrcCheck {
  color: #53afff;
}

.musicContollBox {
  display: flex;
  flex-direction: column;
  margin-left: 0.1rem;
  flex-shrink: 1;
  flex-grow: 1;
}

.musicContoll {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
}

.musicContollLeft {
  display: flex;
  align-items: center;
  width: 100%;
}
.musicContollRight {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.musicContollLeft i {
  margin-right: 0.2rem;
}

.musicContoll i {
  font-size: 0.12rem;
  cursor: default;
  user-select: none;
  cursor: pointer;
}

.musicContoll i:active {
  color: #53afff !important;
}

.musicTitle p {
  font-size: 0.12rem;
  max-width: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  margin: 0 0 0.1rem;
}

.playAnima {
  animation: linear playAnima 8s infinite;
}

@keyframes playAnima {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

@media (max-width: 750px) {
  .musicBox {
    display: none;
  }
}
</style>
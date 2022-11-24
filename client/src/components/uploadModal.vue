<!--
 * @Author: LRolinx
 * @Date: 2021-01-09 21:55:39
 * @LastEditTime 2021-12-16 10:05
 * @Description: 上传模态窗
 * 
-->
<template>
  <div class="body" v-if="uploadBufferPool.length!=0">
    <div :class="{minimize:isMinimize}" class="upLoadListBox" ref="upLoadListBox">
      <div class="head" :style="{flex:isMinimize?1:0}" @click="isMinimize && minimizeOrMaximize()">
        <div class="head_left">
          <i class="headLeftIcon iconfont icon-transfer"></i>
          <p class="headLeftP">正在上传·剩余{{uploadRemainingTask}}项</p>
        </div>
        <div class="head_right">
          <i class="headRightIcon iconfont icon-pause"></i>
          <!-- <i class="headRightIcon iconfont icon-close-circle-sm" @click="minimizeOrMaximize"></i> -->
        </div>
      </div>

      <ul class="upLoadListUlBox" v-show="!isMinimize">
        <li class="upLoadListLiBox" v-for="(item,index) in uploadBufferPool" :key="index">
          <div class="upLoadListLiLeftBox">
            <i class="iconfont" :class="fileIcon(item.fileType)"></i>
            <div class="rightContentBox">
              <div class="rightContentTitle">
                <p>{{item.fname}}{{item.fext==null||item.fext==''?'':`.${item.fext}`}}</p>
              </div>
              <div class="rightContent">
                <p>{{fileSize(item.fileSize)}}</p>
                ·
                <p>{{upLoadType(item.uploadType)}}</p>
              </div>
            </div>

          </div>
          <div class="upLoadListLiRightBox">
            <i class="iconfont icon-reload" v-if="item.uploadType==4"></i>
          </div>
          <span :style="{width:`${100/item.currentChunkMax*item.uploadCurrentChunkNum}%`}" class="upLoadStopNormal" :class="upLoadTypeColor(item.uploadType)"></span>
        </li>
      </ul>

      <div class="foot" @click="minimizeOrMaximize" v-show="!isMinimize">
        <p>收起</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMinimize: false,
    };
  },
  props: {
    uploadBufferPool: {
      type: Array,
      define: [],
    },
    uploadRemainingTask: {
      type: Number,
      default: 0,
    },
  },
  watch: {},
  methods: {
    minimizeOrMaximize() {
      //最小化或最大化
      this.isMinimize = this.isMinimize ? false : true;
    },
  },
  computed: {
    fileIcon: function () {
      return function (value) {
        console.log(value);
        if (value == "video/mp4") {
          return "icon-video";
        }
        if (value == "application/vnd.android.package-archive") {
          return "icon-Android-hover";
        }
        // if (value == "application/octet-stream") {
        //   return ""
        // }
        // if (value == "application/x-shockwave-flash") {
        //   return ""
        // }
        if (value == "application/zip") {
          return "icon-zip";
        }
        if (value == "application/pdf") {
          return "icon-pdf";
        }
        if (value == "text/html") {
          return "icon-html";
        }
        if (value == "text/plain") {
          return "icon-txt";
        }
        if (value == "image/jpeg") {
          return "icon-pic";
        }
        if (value == "image/png") {
          return "icon-pic";
        }
        return "icon-unknown";
      };
    },
    fileSize: function () {
      return function (value) {
        if (null == value || value == "") {
          return "0yte";
        }
        var unitArr = new Array(
          "Byte",
          "KB",
          "MB",
          "GB",
          "TB",
          "PB",
          "EB",
          "ZB",
          "YB"
        );
        var index = 0;
        var srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2); //保留的小数位数
        return size + unitArr[index];
      };
    },
    upLoadType: function () {
      //uploadType 0等待中 1准备中 2上传中 3上传暂停 4上传完成 5秒传 6文件太小 7文件太大 8文件已存在 404上传错误
      return function (value) {
        return value == 0
          ? "等待中"
          : value == 1
          ? "准备中"
          : value == 2
          ? "上传中"
          : value == 3
          ? "上传暂停"
          : value == 4
          ? "上传完成"
          : value == 5
          ? "秒传"
          : value == 6
          ? "文件太小"
          : value == 7
          ? "文件太大"
          : value == 8
          ? "文件已存在"
          : "上传错误";
      };
    },
    upLoadTypeColor: function () {
      return function (value) {
        return value == 0
          ? ""
          : value == 1
          ? ""
          : value == 2
          ? ""
          : value == 3
          ? "upLoadStop"
          : value == 4
          ? "upLoadSuccess"
          : value == 5
          ? "upLoadError"
          : "upLoadSuccess";
      };
    },
  },
};
</script>
<style scoped>
.body {
  position: fixed;
  bottom: 0.2rem;
  right: 0.2rem;
  z-index: 999;
  display: flex;
}

.minimize {
  height: 1rem !important;
  width: 2rem !important;
  cursor: pointer;
  opacity: 0.8;
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
}

.upLoadListBox {
  height: 5rem;
  width: 4rem;
  background-color: #fff;
  border-radius: 0.2rem;
  box-shadow: 0 0.02rem 0.08rem 0 rgb(0 0 0 / 10%);
  display: flex;
  flex-direction: column;
  transition: ease-in-out 0.2s;
  flex: 1;
}

.head {
  padding: 0.2rem 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head_left {
  display: flex;
  align-items: center;
  font-size: 0.14rem;
}

.headLeftIcon {
  font-size: 0.24rem;
}

.headLeftP {
  margin-left: 0.2rem;
}

.head_right {
  display: flex;
  align-items: center;
}

.headRightIcon {
  font-size: 0.24rem;
  margin-left: 0.2rem;
}

.foot {
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.2rem;
  font-size: 0.14rem;
  user-select: none;
}

.upLoadListUlBox {
  flex-shrink: 1;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  font-size: 0.12rem;
  overflow: auto;
}

.upLoadListUlBox li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.1rem 0.2rem;
  border-bottom: 0.01rem solid rgba(117, 139, 189, 0.1);
  position: relative;
}

.upLoadListLiLeftBox {
  display: flex;
  align-items: center;
  flex-shrink: 1;
  flex-grow: 1;
}

.rightContentBox {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: flex-start;
  margin-left: 0.2rem;
}

.rightContentTitle {
  font-size: 0.14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rightContent {
  display: flex;
  font-size: 0.12rem;
  color: #aaa;
  flex-shrink: 0;
  flex-grow: 0;
  letter-spacing: 0.02rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upLoadListLiRightBox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.upLoadListLiLeftBox i {
  font-size: 0.4rem;
  z-index: 99;
}

/* .upLoadListLiLeftBox p {
  margin-left: 0.1rem;
  z-index: 99;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */

.upLoadStopNormal {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgb(185 222 255 / 30%),
    rgba(0, 89, 255, 0.3)
  );
  transition: ease-in 0.2s;
}

.upLoadStop {
  background: linear-gradient(
    90deg,
    rgb(194 194 194 / 30%),
    rgba(0, 89, 255, 0.3)
  );
}

.upLoadSuccess {
  background: linear-gradient(
    90deg,
    rgb(245 255 83 / 30%),
    rgba(0, 89, 255, 0.3)
  );
}

.upLoadError {
  background: linear-gradient(
    90deg,
    rgb(255 83 83 / 30%),
    rgba(0, 89, 255, 0.3)
  );
}

.upLoadListLiRightBox i {
  z-index: 99;
}

.upLoadListLiRightBox p {
  padding: 0 0.1rem;
  z-index: 99;
}
</style>
<!--
 * @Author: LRolinx
 * @Date: 2021-01-06 12:42:19
 * @LastEditTime: 2021-01-20 18:51:03
 * @Description: icon预览列表
 * 
-->
<template>
  <div class="body">
    <lscrollBar>
      <div class="iconList">
        <li class="iconfont" :class="item.iconClass" v-for="(item,index) in iconfontList" :key="index">
          <p>{{item.iconClass}}</p>
          <p>{{item.name}}</p>
        </li>
      </div>
    </lscrollBar>
  </div>
</template>
<script>
import {toRefs, getCurrentInstance } from "vue";
import { useStore } from "@/store/index.ts";
import lscrollBar from '@/components/lscrollbar.vue'
export default {
  created() {

    const data = {
      iconfontList: [
        {
          iconClass: "icon-loop-single",
          name: "循环单首"
        }, {
          iconClass: "icon-play-list",
          name: "播放列表"
        }, {
          iconClass: "icon-maximize",
          name: "最大化"
        }, {
          iconClass: "icon-file-cancel",
          name: "文件关闭"
        }, {
          iconClass: "icon-file-add",
          name: "文件确定"
        }, {
          iconClass: "icon-audio-suspend",
          name: "播放暂停"
        }, {
          iconClass: "icon-feedback",
          name: "反馈"
        }, {
          iconClass: "icon-minimize",
          name: "最小化"
        }, {
          iconClass: "icon-play-close",
          name: "播放关闭"
        }, {
          iconClass: "icon-loop-random",
          name: "循环随机"
        }, {
          iconClass: "icon-loop-list",
          name: "循环列表"
        }, {
          iconClass: "icon-play-drag",
          name: "播放拖动"
        }, {
          iconClass: "icon-or-play",
          name: "播放小"
        }, {
          iconClass: "icon-play",
          name: "播放"
        }, {
          iconClass: "icon-next-one",
          name: "下一首"
        }, {
          iconClass: "icon-before-one",
          name: "上一首"
        }, {
          iconClass: "icon-ps",
          name: "倒序"
        }, {
          iconClass: "icon-ro",
          name: "顺序"
        }, {
          iconClass: "icon-video-screenfull-exit",
          name: "视频全屏退出"
        }, {
          iconClass: "icon-video-screenfull-enter",
          name: "视频全屏进入"
        }, {
          iconClass: "icon-video-next",
          name: "视频下一个"
        }, {
          iconClass: "icon-video-volume",
          name: "视频音量"
        }, {
          iconClass: "icon-video-mute",
          name: "视频静音"
        }, {
          iconClass: "icon-p-in-p",
          name: "画中画"
        }, {
          iconClass: "icon-video-play",
          name: "视频播放"
        }, {
          iconClass: "icon-video-pause",
          name: "视频暂停"
        }, {
          iconClass: "icon-folder-phone",
          name: "文件夹手机"
        }, {
          iconClass: "icon-folder-default",
          name: "文件夹默认"
        }, {
          iconClass: "icon-folder-share",
          name: "文件夹共享"
        }, {
          iconClass: "icon-folder-video",
          name: "文件夹视频"
        }, {
          iconClass: "icon-folder-lock",
          name: "文件夹锁"
        }, {
          iconClass: "icon-volume",
          name: "音量"
        }, {
          iconClass: "icon-play-list1",
          name: "播放列表1"
        }, {
          iconClass: "icon-vsd",
          name: "vsd文件"
        }, {
          iconClass: "icon-doc",
          name: "doc文件"
        }, {
          iconClass: "icon-excel",
          name: "excel文件"
        }, {
          iconClass: "icon-pdf",
          name: "pdf文件"
        }, {
          iconClass: "icon-ppt",
          name: "ppt文件"
        }, {
          iconClass: "icon-pic",
          name: "pic文件"
        }, {
          iconClass: "icon-video",
          name: "video文件"
        }, {
          iconClass: "icon-apk",
          name: "apk文件"
        }, {
          iconClass: "icon-wps-excel",
          name: "wps-excel文件"
        }, {
          iconClass: "icon-apple-ppt",
          name: "apple-ppt文件"
        }, {
          iconClass: "icon-html",
          name: "html文件"
        }, {
          iconClass: "icon-apple-word",
          name: "apple-word文件"
        }, {
          iconClass: "icon-apple-excel",
          name: "apple-excel文件"
        }, {
          iconClass: "icon-wps-word",
          name: "wps-word文件"
        }, {
          iconClass: "icon-wps-ppt",
          name: "wps-ppt文件"
        }, {
          iconClass: "icon-srt",
          name: "srt文件"
        }, {
          iconClass: "icon-rtf",
          name: "rtf文件"
        }, {
          iconClass: "icon-xmind",
          name: "xmind文件"
        }, {
          iconClass: "icon-bt",
          name: "bt文件"
        }, {
          iconClass: "icon-mobi",
          name: "mobi文件"
        }, {
          iconClass: "icon-starred",
          name: "收藏"
        }, {
          iconClass: "icon-music",
          name: "music文件"
        }, {
          iconClass: "icon-txt",
          name: "txt文件"
        }, {
          iconClass: "icon-upload-file",
          name: "上传文件"
        }, {
          iconClass: "icon-upload-folder",
          name: "上传文件夹"
        }, {
          iconClass: "icon-win-hover",
          name: "winHover"
        }, {
          iconClass: "icon-unknown",
          name: "未知文件"
        }, {
          iconClass: "icon-epub",
          name: "epub文件"
        }, {
          iconClass: "icon-word",
          name: "word文件"
        }, {
          iconClass: "icon-zip",
          name: "压缩包文件"
        }, {
          iconClass: "icon-iPhone-hover",
          name: "iPhoneHover"
        }, {
          iconClass: "icon-name",
          name: "名称"
        }, {
          iconClass: "icon-file",
          name: "文件"
        }, {
          iconClass: "icon-Android-hover",
          name: "AndroidHover"
        }, {
          iconClass: "icon-macOS-hover",
          name: "macOSHover"
        }, {
          iconClass: "icon-turn-page-pre",
          name: "上一页"
        }, {
          iconClass: "icon-turn-page-next",
          name: "下一页"
        }, {
          iconClass: "icon-folder",
          name: "文件夹"
        }, {
          iconClass: "icon-yun",
          name: "云上传"
        }, {
          iconClass: "icon-windows",
          name: "windows"
        }, {
          iconClass: "icon-mac",
          name: "mac"
        }, {
          iconClass: "icon-linux",
          name: "linux"
        }, {
          iconClass: "icon-pause",
          name: "暂停"
        }, {
          iconClass: "icon-folder1",
          name: "文件夹1"
        }, {
          iconClass: "icon-file1",
          name: "文件1"
        }, {
          iconClass: "icon-screen-full-quit",
          name: "屏幕缩小"
        }, {
          iconClass: "icon-11",
          name: "等比大小"
        }, {
          iconClass: "icon-zoom-in",
          name: "放大"
        }, {
          iconClass: "icon-zoom-out",
          name: "缩小"
        }, {
          iconClass: "icon-mirror-x",
          name: "镜像X"
        }, {
          iconClass: "icon-mirror-y",
          name: "镜像Y"
        }, {
          iconClass: "icon-viewer-info",
          name: "视图关于"
        }, {
          iconClass: "icon-screen-full",
          name: "屏幕缩放"
        }, {
          iconClass: "icon-rotate-left",
          name: "旋转左"
        }, {
          iconClass: "icon-rotate-right",
          name: "旋转右"
        }, {
          iconClass: "icon-close-circle-sm",
          name: "关闭实心小"
        }, {
          iconClass: "icon-download",
          name: "下载"
        }, {
          iconClass: "icon-info",
          name: "关于"
        }, {
          iconClass: "icon-delete",
          name: "删除"
        }, {
          iconClass: "icon-check-circle-sm",
          name: "选中实行小"
        }, {
          iconClass: "icon-Android",
          name: "Android"
        }, {
          iconClass: "icon-iPhone",
          name: "iPhone"
        }, {
          iconClass: "icon-macOS",
          name: "macOS"
        }, {
          iconClass: "icon-win",
          name: "win"
        }, {
          iconClass: "icon-close-circle-lg",
          name: "关闭实心大"
        }, {
          iconClass: "icon-warning-circle",
          name: "警告实心"
        }, {
          iconClass: "icon-play-outline",
          name: "播放空心"
        }, {
          iconClass: "icon-close-sm",
          name: "关闭小"
        }, {
          iconClass: "icon-reload",
          name: "重载"
        }, {
          iconClass: "icon-star",
          name: "开始"
        }, {
          iconClass: "icon-check-circle",
          name: "多选实心"
        }, {
          iconClass: "icon-add-folder",
          name: "添加文件夹"
        }, {
          iconClass: "icon-close-circle",
          name: "关闭实心"
        }, {
          iconClass: "icon-list",
          name: "列表"
        }, {
          iconClass: "icon-cloud",
          name: "云"
        }, {
          iconClass: "icon-drive",
          name: "文件夹"
        }, {
          iconClass: "icon-storage",
          name: "存储"
        }, {
          iconClass: "icon-move",
          name: "移动"
        }, {
          iconClass: "icon-info-circle",
          name: "关于实心"
        }, {
          iconClass: "icon-minus",
          name: "最小化"
        }, {
          iconClass: "icon-transfer",
          name: "上载下载"
        }, {
          iconClass: "icon-hook",
          name: "打勾"
        }, {
          iconClass: "icon-triangle-copy-copy-copy1",
          name: "三角形上"
        }, {
          iconClass: "icon-triangle-copy-copy-copy",
          name: "三角形下"
        }, {
          iconClass: "icon-edit",
          name: "编辑"
        }, {
          iconClass: "icon-add",
          name: "添加"
        }, {
          iconClass: "icon-loading",
          name: "加载"
        }, {
          iconClass: "icon-grid",
          name: "格子"
        }, {
          iconClass: "icon-help-circle",
          name: "帮助实心"
        }, {
          iconClass: "icon-close",
          name: "关闭"
        }, {
          iconClass: "icon-arrow-up",
          name: "箭头上"
        }, {
          iconClass: "icon-arrow-down",
          name: "箭头下"
        }, {
          iconClass: "icon-arrow-right",
          name: "箭头右"
        }, {
          iconClass: "icon-arrow-left",
          name: "箭头左"
        }, {
          iconClass: "icon-search",
          name: "搜索"
        }, {
          iconClass: "icon-more",
          name: "更多"
        }, {
          iconClass: "icon-share",
          name: "分享"
        }
      ],
    }

    const store = useStore();
    const { appContext } = getCurrentInstance();
    const globalProperties = appContext.config.globalProperties;

    if (!store.isLogin) {
      globalProperties.$router.replace({ name: 'login' });//没登录直接回到登录页
    }


    return {
      ...toRefs(data)
    }
  },
  components: {
    lscrollBar
  },
}
</script>
<style scoped>
.body {
  width: 100%;
}

.iconList {
  display: grid;
  grid-template-columns: repeat(auto-fill, 20%);
  /* grid-template-rows: repeat(auto-fill, 20%); */
}

.iconfont {
  margin: 0.2rem;
  font-size: 0.48rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* width: 16%; */
  height: 2rem;
  text-align: center;
  background-color: #fff;
  border-radius: 0.2rem;
  transition: ease-in 0.2s;
}

.iconfont:hover {
  background-color: #758bbd;
  color: #fff;
}

.iconfont p {
  font-size: 0.18rem;
}

@media (max-width: 750px) {
  .iconList {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100%);
  }
}
</style>
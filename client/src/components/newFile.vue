<!--
 * @Author: LRolinx
 * @Date: 2021-01-24 15:41:50
 * @LastEditTime 2021-12-15 14:54
 * @Description: 新建文件模态窗
 * 
-->
<template>
  <div class="componentBody">
    <div class="mask" @click="closeNewFileModel" v-if="isShowNewFileModel">
      <ul class="newFileBox" @click.stop="">
        <li @click="checkFile">
          <div>
            <i class="iconfont icon-add"></i>
            <p>选择文件</p>
            <input id="checkFile" @change="change()" title="点击选择文件" class="updateButton" multiple="" accept="*/*" type="file" name="html5uploader" style="display:none;">
          </div>
        </li>
        <!-- <li>
          <div>
            <i class="iconfont icon-folder"></i>
            <p>选择文件夹</p>
            <input title="点击选择文件夹" class="updateButton" multiple="" webkitdirectory="" accept="*/*" type="file" name="html5uploader" style="display:none;">
          </div>
        </li> -->
        <li  @click="openNewFolderModel">
          <div>
            <i class="iconfont icon-add-folder"></i>
            <p>新建文件夹</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShowNewFileModel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    change() {
     const file = document.querySelector("#checkFile").files[0];
     this.$emit("oneFile",file);
     this.closeNewFileModel();
    },
    checkFile() {
      //选择文件
      document.querySelector("#checkFile").click();
    },
    openNewFolderModel() {
      this.$parent.openNewFolderModel();
      this.closeNewFileModel();
    },
    closeNewFileModel() {
      //关闭新建模态窗
      this.$emit("update:isShowNewFileModel", false);
    },
  }
}
</script>
<style scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  /* background-color: rgba(0, 0, 0, 0.2); */
  background-color: rgba(117, 139, 189, 0.14);
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  user-select: none;
}

.newFileBox {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  overflow: hidden;
  margin: 0 0.2rem;
  animation: ease-in forwards newFileBox 0.2s;
}

@keyframes newFileBox {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.98);
  }
  80% {
    opacity: 1;
    transform: scale(0.98);
  }
  100% {
    transform: translateY(0px);
    transform: scale(1);
  }
}

.newFileBox li {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-bottom: 0.01rem solid #eee;
  width: 100%;
  justify-content: center;
  transition: ease-in 0.2s;
  cursor: pointer;
}

.newFileBox li:hover {
  background-color: #758bbd;
  color: #fff;
}

.newFileBox div {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.1rem 0.2rem;
  margin: 0.1rem 0.2rem;
}

.newFileBox i {
  font-size: 0.2rem;
  padding: 0 0.02rem;
}

.newFileBox p {
  font-size: 0.14rem;
}
</style>
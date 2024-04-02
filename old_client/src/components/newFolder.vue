<!--
 * @Author: LRolinx
 * @Date: 2021-01-24 15:30:17
 * @LastEditTime: 2021-01-24 17:47:56
 * @Description: 新建文件夹模态窗
 * 
-->
<template>
  <div class="componentBody">
    <div class="mask" @click="closeNewFolderModel" v-if="isShowNewFolderModel">
      <div class="newFolderBox" @click.stop="">
        <div class="contentBox">
          <p>新建文件夹</p>
          <input class="zp-input" v-model="folderName" @keypress="keyDown($event)" placeholder="文件夹名称" autofocus maxlength="64">
          <button type="button" class="button" @click="success">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShowNewFolderModel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      folderName: "",
    }
  },
  methods: {
    keyDown(e) {
      switch(e.keyCode) {
        case 13:
          this.success();
          break;
      }
    },
    success() {
      this.$emit("changeValue",this.folderName)
      this.closeNewFolderModel();
    },
    closeNewFolderModel() {
      //关闭新建文件模态窗
      this.folderName = "";
      this.$emit("update:isShowNewFolderModel", false);
    },
  }
}
</script>
<style scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: rgba(117, 139, 189, 0.14);
  display: flex;
  align-items: center;
  user-select: none;
}

.newFolderBox {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  /* flex-grow: 1; */
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  overflow: hidden;
  margin: 0 0.2rem;
  /* animation: ease-in forwards newFileBox 0.2s; */
}

@keyframes newFileBox {
  0% {
    opacity: 0;
    transform: translateY(1rem) scale(0.98);
  }
  80% {
    opacity: 1;
    transform: scale(0.98);
  }
  100% {
    transform: translateY(0);
    transform: scale(1);
  }
}

.contentBox {
  border-radius: 0.2rem;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.contentBox p {
  font-size: 0.14rem;
  padding: 0.2rem;
}

.zp-input {
  font-size: 0.14rem;
  outline: none;
  border: 0.02rem solid #758bbd;
  border-radius: 0.2rem;
  padding: 0.1rem 0.2rem;
  margin: 0 0.2rem 0.2rem;
}

.button {
  display: inline-block;
  padding: 0.1rem 0.2rem;
  font-size: 0.14rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #758bbd;
  border: none;
  border-radius: 0.2rem;
  margin: 0 0.2rem 0.2rem;
}

.button:active {
  background-color: #758bbd;
}
</style>
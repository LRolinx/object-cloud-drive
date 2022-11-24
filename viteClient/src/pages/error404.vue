<!--
 * @Author: LRolinx
 * @Date: 2021-01-06 22:38:49
 * @LastEditTime: 2021-01-06 23:05:19
 * @Description: 错误404
 * 
-->
<template>
  <div class="body">
    <div class="cententBox">
      <img class="cententImg" src="https://cn.bing.com/th?id=OHR.SnowCraterLake_ZH-CN9218350129_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp">
      <div class="cententRightBox">
        <p class="cententRightTitle">Sorry,找不到网页了</p>
        <p class="cententRightText">可能原因</p>
        <p class="cententRightText">1.页面不存在</p>
        <p class="cententRightText">2.服务器关闭</p>
        <div class="cententRightButtonBox">
          <p class="cententRightButton" @click="backHome">返回</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods:{
     backHome() {
       this.$router.replace({ name: 'login' });//回到登录
     }
  }
}
</script>
<style scoped>
.body {
  width: 100vw;
  height: 100vh;
}

.cententBox {
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.cententImg {
  width: 4rem;
  border-radius: 0.2rem;
}

.cententRightBox {
  display: flex;
  flex-direction: column;
  padding: 0 0.3rem;
}

.cententRightTitle {
  font-size: 0.24rem;
  font-weight: bold;
  padding: 0.2rem 0;
  color: rgb(117, 139, 189);
}

.cententRightText {
  font-size: 0.18rem;
  color: rgb(117, 139, 189);
}

.cententRightButtonBox {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.2rem;
}

.cententRightButton {
  border-radius: 0.05rem;
  width: max-content;
  font-size: 0.18rem;
  color: #fff;
  background: rgb(117, 139, 189);
  padding: 0.05rem 0.3rem;
  user-select: none;
  cursor: pointer;
}
</style>
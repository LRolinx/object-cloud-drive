<!--
 * @Author: LRolinx
 * @Date: 2021-01-21 11:25:07
 * @LastEditTime: 2021-01-25 12:56:01
 * @Description: 交互效果DEMO
 * 
-->
<template>
  <div>
    <h6>PC端</h6>

    <h6>Phone端</h6>
    <div class="showBox">
      <p class="title">长按效果</p>
      <div class="trigger" @touchstart.prevent="touchstart" @touchend.prevent="touchend" @touchmove.prevent="touchmove ">
        长按

        <svg width="100" height="100" class="svgClass" :style="{left:`${touchXY[0]}px`,top:`${touchXY[1]}px`}">
          <circle fill="none" stroke="#758bbd" stroke-width="10" cx="50" cy="50" r="40" transform="rotate(-90 50 50)" stroke-linecap="round" class="circle" :style="{'stroke-dashoffset':`${250-schedule*2.5}px`}" v-if="schedule!=0" />
        </svg>

      </div>

    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      touchXY: [0, 0],//手指点击坐标
      touchStartPressTime: null,//开始长按计时器
      touchPressTime: null,//长按计时器
      schedule: 0,//进度
      touchChendMaxNum: 5,//最大偏移坐标取消长按
    }
  },
  mounted() {
  //  console.log(new RegExp('(?<=\\${{).*?(?=}})')) 
  },
  methods: {
    touchstart(e) {
      console.log(e.touches[0]);
      this.$set(this.touchXY, 0, e.touches[0].pageX);
      this.$set(this.touchXY, 1, e.touches[0].pageY);

      //触摸开始
      if (this.touchStartPressTime != null) {
        clearInterval(this.touchStartPressTime);
        this.touchStartPressTime = null
      }
      if (this.touchPressTime != null) {
        clearInterval(this.touchPressTime);
        this.touchPressTime = null
      }

      this.touchStartPressTime = setTimeout(() => {
        this.touchPressTime = setInterval(() => {
          if (this.schedule < 100) {
            this.schedule++;
          }
        }, 5)
      }, 400)
    },
    touchmove(e) {
      //触摸移动
      if (e.touches[0].pageX > this.touchXY[0] + this.touchChendMaxNum || e.touches[0].pageY > this.touchXY[1] + this.touchChendMaxNum) {
        if (this.touchStartPressTime != null) {
          clearInterval(this.touchStartPressTime);
          this.touchStartPressTime = null
        }
        if (this.touchPressTime != null) {
          clearInterval(this.touchPressTime);
          this.touchPressTime = null
        }
        this.schedule = 0;
      } else if (e.touches[0].pageX < this.touchXY[0] - this.touchChendMaxNum || e.touches[0].pageY < this.touchXY[1] - this.touchChendMaxNum) {
        if (this.touchStartPressTime != null) {
          clearInterval(this.touchStartPressTime);
          this.touchStartPressTime = null
        }
        if (this.touchPressTime != null) {
          clearInterval(this.touchPressTime);
          this.touchPressTime = null
        }
        this.schedule = 0;
      }
    },
    touchend() {
      //触摸结束
      if (this.touchStartPressTime != null) {
        clearInterval(this.touchStartPressTime);
        this.touchStartPressTime = null
      }
      if (this.touchPressTime != null) {
        clearInterval(this.touchPressTime);
        this.touchPressTime = null
      }
      this.schedule = 0;
    },
  }
}

</script>
<style scoped>
h6 {
  font-size: 0.24rem;
  margin: 0;
}

.title {
  font-size: 0.18rem;
  padding-bottom: 0.1rem;
}

.showBox {
  background-color: #fff;
  padding: 0.2rem;
  margin: 0.2rem 0;
  border-radius: 0.2rem;
}

.trigger {
  border: 2px solid #758bbd;
  font-size: 0.12rem;
  padding: 1rem;
  border-radius: 0.2rem;
  position: relative;
}

/*  */
.svgClass {
  position: absolute;
  transform: translate(-135%,-238%);
}

.circle {
  stroke-dasharray: 250px;
  /* stroke-dashoffset: 250px; */
}
</style>
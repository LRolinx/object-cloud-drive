<script setup lang="ts">
import { useAppStore } from '@/store/models/app'
import { onMounted } from 'vue'
const appStore = useAppStore()

//监听浏览器大小变化
window.onresize = () => {
  return (() => {
    appStore.width = window.innerWidth
    appStore.height = window.innerHeight
  })()
}

onMounted(() => {
  appStore.width = window.innerWidth
  appStore.height = window.innerHeight
})
</script>
<template>
  <router-view></router-view>
</template>

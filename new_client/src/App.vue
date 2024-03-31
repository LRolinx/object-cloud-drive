<script setup lang="ts">
import { useAppStore } from '@/store/models/app'
import { LoadingA } from '@/components/loading/LoadingA'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const appStore = useAppStore()
const route = useRoute()

//监听浏览器大小变化
window.onresize = () => {
  return (() => {
    appStore.width = window.innerWidth
    appStore.height = window.innerHeight
  })()
}

onMounted(() => {
  appStore.initState = true
  appStore.width = window.innerWidth
  appStore.height = window.innerHeight
})
</script>
<template>
  <LoadingA :open="!appStore.initState"></LoadingA>
  {{ route.meta.keepAlive }}
  <keep-alive>
    <router-view v-if="route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!route.meta.keepAlive"></router-view>
</template>

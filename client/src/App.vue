<script setup lang="ts">
import { useAppStore } from '@/store/models/app'
import { onMounted } from 'vue'
import { AppTheme } from '@/script/AppTheme'
import { getTwoToneColor, setTwoToneColor } from '@ant-design/icons-vue'
const appStore = useAppStore()

//设置图标颜色为主题色
setTwoToneColor(AppTheme.primaryColor)

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
  <a-config-provider :theme="{ token: { colorPrimary: AppTheme.primaryColor } }">
    <router-view></router-view>
  </a-config-provider>
</template>

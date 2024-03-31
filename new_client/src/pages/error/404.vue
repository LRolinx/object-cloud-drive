<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NotFoundPage',
})

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>
<template>
  <div style="position: fixed; width: 100vw; height: 100vh; z-index: 14; background: white">
    <a-result
      status="404"
      title="404"
      sub-title="页面不存在"
    >
      <template #extra>
        <a-button
          type="primary"
          @click="goBack"
        >
          返回
        </a-button>
      </template>
    </a-result>
  </div>
</template>

import { createApp } from 'vue'
import App from '@/App.vue'
import Antd, { message } from 'ant-design-vue'
import routers from '@/routers'
import pinia from '@/store'
import { getpublickeyapi } from '@/api/user'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import { useAppStore } from './store/models/app'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
const app = createApp(App)
app.use(pinia)
app.use(Antd)
app.use(routers)
app.use(VueVirtualScroller)
app.use(VXETable)
app.mount('#app')
const appStore = useAppStore()

// 程序运行获取公开密钥 用于后面登录验证
getpublickeyapi().then(async (resp) => {
  const data = await resp
  if (data.status !== 200) {
    return message.error('获取公钥失败')
  }
  appStore.publickey = data.data
  console.log(appStore.publickey)
})

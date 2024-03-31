import './style.css'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './static/css/iconFont.css'
import './assets/fonts/cnrIcon.css'

import { createApp } from 'vue'
import App from './App.vue'
import lPromptBox from '@/components/lpromptbox.vue'
import router from '@/routers'
import { AxiosPluginRegister } from '@/utils/axios'
import pinia from '@/store'
// import VueVirtualScroller from 'vue-virtual-scroller'

// import dialogMessge from '@/components/dialogMessge.js'
// import VueVirtualScroller from 'vue-virtual-scroller'

const app = createApp(App)

// import driveRouter from "./router/drive.js"
app.use(router)
app.use(pinia)
app.use(AxiosPluginRegister)
// app.use(VueVirtualScroller)

app.component('lPromptBox', lPromptBox)
// app.config.globalProperties.$tipMessge = tipMessge;

// app.config.globalProperties.$dialogMessge = dialogMessge;

// app.use(router).use(createPinia().use(piniaPluginPersist)).use(VueVirtualScroller).use(tipMessge).mount('#app')
app.mount('#app')

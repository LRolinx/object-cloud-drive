/*
 * @Author: LRolinx
 * @Date: 2020-10-14 20:58:01
 * @LastEditTime: 2022-03-16 19:29:17
 * @Description:
 *
 */
import './static/css/iconFont.css'
import { createApp } from 'vue';
import App from './App.vue'
import './assets/fonts/cnrIcon.css'
import lPromptBox from './components/lpromptbox.vue'
import router from "./router/router.js"
import axios from './utils/axios'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import tipMessge from '@/components/tipMessge.js'
// import dialogMessge from '@/components/dialogMessge.js'
import VueVirtualScroller from 'vue-virtual-scroller'

const app = createApp(App)

// import driveRouter from "./router/drive.js"

app.config.globalProperties.$http = axios;
app.component('lPromptBox', lPromptBox);
app.config.globalProperties.$tipMessge = tipMessge;


// app.config.globalProperties.$dialogMessge = dialogMessge;

// Vue.use(VueVirtualScroller)

app.use(router).use(createPinia().use(piniaPluginPersist)).use(VueVirtualScroller).use(tipMessge).mount('#app')

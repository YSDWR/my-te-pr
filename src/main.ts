import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueGridLayout from 'vue-grid-layout'
import overflowTooltip from '@/direactives/overflow-tooltip.ts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueGridLayout)
app.directive('overflow-tooltip', overflowTooltip)

app.mount('#app')

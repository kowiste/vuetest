import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { WebsocketPlugin } from '@/plugins/websocket/init'
import type { IWebsocketOption } from './plugins/websocket/model'
const app = createApp(App)

const wsOptions = {
  log: true,
} as IWebsocketOption

app.use(createPinia()).use(router).use(WebsocketPlugin, wsOptions)

app.mount('#app')

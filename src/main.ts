import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { WebsocketPlugin } from '@/plugins/websocket/init'
import type { IWebsocketOption } from './plugins/websocket/model'
import { ThemeBsPlugin } from '@/plugins/theme/init'
import type { IThemeOption } from './plugins/theme/model'


const app = createApp(App)

const wsOptions = {
  log: true,
} as IWebsocketOption
const themeOption = {} as IThemeOption

app
  .use(createPinia())
  .use(router)
  .use(WebsocketPlugin, wsOptions)
  .use(ThemeBsPlugin, themeOption)

app.mount('#app')

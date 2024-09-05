import { createPinia, type Pinia } from 'pinia'
import { type App, type Plugin } from 'vue'
import { type IWebsocketOption } from './model'
import { useWebsocketStore } from './store'

export const WebsocketPlugin: Plugin = {
  install(app: App, options?: IWebsocketOption) {
    let pinia: Pinia | null = app.config.globalProperties.$pinia
    if (!pinia) {
      pinia = createPinia()
      app.use(pinia)
    }
    const ws = useWebsocketStore()
    if (options) ws.setOptions(options)
  },
}

import { createPinia, type Pinia } from 'pinia'
import { type App, type Plugin } from 'vue'
import { type IThemeOption } from './model'
import { useTheme } from './store'
import './scss/theme.scss'

export const ThemeBsPlugin: Plugin = {
  install(app: App, options?: IThemeOption) {
    let pinia: Pinia | null = app.config.globalProperties.$pinia
    if (!pinia) {
      pinia = createPinia()
      app.use(pinia)
    }
    const ws = useTheme()
    if (options) ws.setOptions(options)
  },
}

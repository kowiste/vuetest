import { defineStore } from 'pinia'
import { EThemeStatus, type IThemeOption } from './model'
interface State {
  Status: EThemeStatus
  Options?: IThemeOption
}

export const useTheme = defineStore('useTheme', {
  state: (): State => ({
    Status: EThemeStatus.Light,
  }),
  actions: {
    change(data: EThemeStatus) {
      switch (data) {
        case EThemeStatus.Dark:
          document.body.classList.add('dark-theme')
          document.body.classList.remove('light-theme')
          break
        case EThemeStatus.Light:
          document.body.classList.add('light-theme')
          document.body.classList.remove('dark-theme')
          break
      }
      this.Status = data
    },
    setOptions(data: IThemeOption) {
      this.Options = data
    },
  },
  getters: {
    status(): EThemeStatus {
      return this.Status
    },
  },
})

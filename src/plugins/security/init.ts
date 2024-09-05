import { createPinia, type Pinia } from 'pinia'
import { type App, type Plugin } from 'vue'
import { useKeycloakStore } from './store'
import Keycloak from 'keycloak-js'
import { env } from '@/utils/const'

export const KeycloakPlugin: Plugin = {
  install(app: App, options: any) {
    let pinia: Pinia | null = app.config.globalProperties.$pinia
    if (!pinia) {
      pinia = createPinia()
      app.use(pinia)
    }

    const kc = useKeycloakStore()
    const keycloak = new Keycloak(options)
    keycloak
      .init({
        checkLoginIframe: false,
        redirectUri: env.keycloakBase,
      })
      .then(() => {
        kc.setKeycloak(keycloak)
      })
      .catch((err: Error) => {
        console.log('error', err)
        kc.setKeycloak(new Keycloak())
      })
  },
}

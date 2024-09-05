import type { RouteLocationNormalized } from 'vue-router'
import { useKeycloakStore } from './store'

export async function keycloakGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const authStore = useKeycloakStore()
  if (to.meta.requiresAuth) {
    await authStore.init
    await authStore.login(to.fullPath)
    const nextURL = to.fullPath.split('#')[0]
    if (to.fullPath !== nextURL) {
      to.fullPath = nextURL
      return to.fullPath
    }
  }
}

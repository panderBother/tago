import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createSSRApp } from 'vue'
import 'lxgw-wenkai-screen-webfont/style.css'
import App from './App.vue'
import './styles/theme.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  return {
    app,
  }
}

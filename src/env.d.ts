/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_API_BROWSER_PROXY?: string
  readonly VITE_API_CDP_URL?: string
  readonly VITE_USE_FIXTURES?: string
  readonly VITE_TAGO_DEV_EMAIL?: string
  readonly VITE_TAGO_DEV_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

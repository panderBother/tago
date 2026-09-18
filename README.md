# TAGO uni-app

TAGO 的跨端前端原型实现。技术栈为 uni-app + Vue 3 + TypeScript + Vite，基础件采用 wot-design-uni，手账风业务组件位于 `src/components/business`。

## 启动

```bash
pnpm install
pnpm dev:h5
```

浏览器打开终端输出的本地地址。微信小程序构建使用 `pnpm build:mp-weixin`。

## 工程约定

- Base URL 在 `.env.*` 中配置。H5 始终请求同源 `/api`；本地开发和 `vite preview` 会把它代理至 `VITE_API_PROXY_TARGET`。正式部署时，Web 服务器也需要配置同样的 `/api` 反向代理。
- `pnpm api:generate` 从只读 API 站点生成 `src/api/types/generated.ts`，请勿手改生成文件。
- 当前 OpenAPI 仅包含 auth 与 chats；Tag、申请、礼物页面使用 `src/mocks/fixtures.ts`。真实接口补齐后只需在 `src/api` 和 mapper 层替换数据源。
- 业务组件只通过 typed props/emits 交互；页面负责组合，异步状态放入 composable，跨页状态放入 Pinia。

## 验收命令

```bash
pnpm type-check
pnpm test:run
pnpm build:h5
pnpm build:mp-weixin
```

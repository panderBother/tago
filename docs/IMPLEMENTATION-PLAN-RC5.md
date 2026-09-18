# TAGO 原型还原与 API 全链路实施方案（OpenAPI rc.5）

## 目标

在不把动态内容烘焙进背景图的前提下，尽可能复刻原型的纸张、水彩、手写和贴纸质感；所有业务数值、昵称、Tag、问题、回答、状态和流水都继续由真实接口或 fixture 数据驱动。无原型页面采用 QQ 式分组信息架构，但沿用 TAGO 的视觉语言。

## 实施顺序

1. 对照 8 张原型逐屏拆分信息层级、间距、卡片比例和装饰元素。
2. 用视觉模型生成设置页与服务管理页的独立参考图，不直接当页面背景。
3. 建立共用的无边框返回、双滑杆设置入口、纸张分组、状态行组件。
4. 优先修复差异最大的礼物路书、聊天、回答和回答对照页，再统一发现、相遇、申请和创作页。
5. 从远端 OpenAPI rc.5 重新生成类型，把无既有 UI 的接口收口到“服务与管理”和“管理员工具”。
6. 依次执行类型检查、单元测试、H5 构建、fixture 构建和浏览器截图验收。

## 视觉实现约束

- 动态字段一律由 Vue 组件渲染；插画只作为无语义装饰。
- 书本、月亮、相机、游戏机等使用透明 PNG、SVG 或 CSS 绘制。
- 返回按钮没有外框；设置按钮使用双滑杆图形，作为右上角辅助动作。
- 页面不使用完整原型截图做底图或热区，以免遮蔽接口数据和交互状态。
- 小型、随 Tag 变化的装饰图标不参与业务映射。

## rc.5 接口展示覆盖（65/65）

| 领域 | Operation | 项目入口 |
| --- | --- | --- |
| 账号（3） | `identityChangePassword`, `publicIdentityGet`, `publicIdentityUpdate` | 设置 → 资料 / 账号安全 |
| 管理员（10） | `reauthenticate`, `user`, `freeze`, `unfreeze`, `submitBatch`, `batch`, `batchItems`, `retry`, `adjust`, `adjustment` | 设置 → 服务与管理 → 管理员工具 |
| 申请（4） | `listIntroductionApplications`, `getIntroductionApplication`, `acceptIntroductionApplication`, `rejectIntroductionApplication` | 相遇 → 认识申请 → 回答对照 |
| 认证（10） | `identityGetCsrf`, `identityLogin`, `identityRecoverLogin`, `identityLogout`, `identityLogoutAll`, `identityResetPassword`, `identityRequestPasswordResetCode`, `identityRegister`, `identityRequestRegistrationCode`, `identityGetSession` | 登录 / 注册 / 找回密码 / 设置 |
| 头像（1） | `publicIdentityAvatars` | 设置 → 资料 → 头像选择 |
| 屏蔽（2） | `blockUser`, `unblockUser` | 设置 → 服务与管理 → 屏蔽管理 |
| 聊天（9） | `chatList`, `chatConnection`, `chatPolicy`, `acceptChatPolicy`, `chatResolvePeers`, `chatDetail`, `chatConversationConnection`, `chatEncounterList`, `getEncounterDetail` | 相遇、聊天详情、聊天政策确认、相遇回答抽屉 |
| 发现（2） | `discoverTags`, `refreshDiscovery` | 发现页 / 切换 Tag |
| 曝光（7） | `exposureCurrent`, `exposureBids`, `exposureBid`, `exposureBidResultByKey`, `exposureBidResult`, `exposureCarousel`, `exposureRules` | 设置 → Tag 曝光；支持按竞价 ID 与幂等键回查 |
| 异步操作（1） | `socialOperationStatus` | 设置 → 服务与管理 → 操作进度 |
| Tag（14） | `createTag`, `listMyTagHistory`, `getMyTagHistory`, `getMyTag`, `getPublicTag`, `editTagBody`, `savePublisherAnswer`, `submitIntroductionApplication`, `closeTag`, `publishTag`, `customizeTagQuestions`, `generateTagQuestions`, `customizeTagQuestion`, `refreshTagQuestion` | 发现、创作、回应、历史、设置；三题批量与单题编辑均有入口 |
| 钱包（2） | `walletBalance`, `walletEntries` | 设置 → 礼物路书 |

> 说明：加总为远端规范解析得到的 65 个 operation。CSRF 由请求层自动获取和刷新，不作为人工按钮暴露，但登录、注册及所有写操作都会实际经过该链路。

## 验收标准

- `vue-tsc --noEmit` 无错误。
- 单元测试和两种 H5 构建通过。
- 发现、相遇、申请、创作、回应、对照、聊天、礼物、设置、服务、管理员页面均可由真实路由进入。
- 浏览器验收时没有横向溢出、遮挡、不可点击按钮或把动态文案固化到图片中的情况。

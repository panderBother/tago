# TAGO 前端技术选型方案（评审定稿）

| 项目 | 说明 |
| --- | --- |
| 文档版本 | **v3.1**（结合 PRD v1.1 与 8 张原型校准） |
| 决策依据 | 《技术选型对比-Taro-React-vs-uni-app-Vue.md》加权结论 + 手账风 UI 还原要求 |
| 目标 | 一期 H5 上线 MVP；最大化复用同一代码库产出微信小程序、Android、iOS |
| 约束 | 后端接口已就绪；原型为高度定制手账/贴纸风；开发人力 1–1.5 人 |

---

## 1. 最终选型（一页结论）

> **框架：uni-app + Vue 3 + TypeScript + Vite**
> **组件库：wot-design-uni（地基）+ 自研「手账风」业务组件库（灵魂）**
> **状态：Pinia（持久化）　网络：自封装 request　实时：自封装 WebSocket**
> **产出：共享业务代码与大部分 UI → H5（首发）→ 微信小程序 → Android / iOS App；允许平台适配层与少量端专属实现**

### 为什么最终是它（三句话）

1. TAGO 的近期主战场是 H5 与微信小程序，uni-app 的 Vue3/Vite CLI 路线能覆盖两端，并给后续 App 留出延续路径；对 1–1.5 人团队，交付确定性高于追求理论上的单端性能上限。
2. 原型的核心识别度来自便签、贴纸、纸张纹理与路线时间线。普通 vue 页面适合表达这些效果，但仍须遵守小程序 CSS、资源路径、包体和低端机性能限制，不能承诺“全量 CSS、四端像素级一致”。
3. wot-design-uni 用于 Popup、Dialog、Toast、Picker 等基础件，品牌组件自行实现；主题通过 CSS Token 与 ConfigProvider 双层接入，并在真机矩阵验证。

> React/RN 路线并非被否定：若日后 App 成为绝对主战场且要求原生级体验，可在 App 阶段局部评估；但这属于「验证成功之后」的问题，MVP 阶段不为它预付架构成本。

---

## 2. 完整技术栈清单

| 层 | 选型 | 版本基线 | 说明 |
| --- | --- | --- | --- |
| 跨端框架 | **uni-app** | 创建项目时锁定最新稳定版 | Vue3/Vite TypeScript CLI 模板；日常开发可用 VS Code，App 云打包仍需 HBuilderX CLI / GUI |
| 视图层 | **Vue 3** | 与 uni-app 稳定版兼容矩阵一致 | Composition API + `<script setup>`；不单独追新 Vue 版本 |
| 语言 | **TypeScript** | 与脚手架锁定版本一致 | 业务代码全量 TS，接口 DTO 优先生成，页面 ViewModel 可手写 |
| 构建 | **Vite** | 由 uni-app CLI 依赖锁定 | 不在文档硬编码主版本，避免框架升级与 Vite 不兼容 |
| 基础组件库 | **wot-design-uni** | 锁定并记录已验收版本 | 仅选用经 H5、微信真机与 App 验证的基础件 |
| 业务组件库 | **自研 `@tago/ui`**（项目内 `src/components/business`） | — | 手账风全部核心组件，见第 4 节 |
| 状态管理 | **Pinia** + 持久化插件 | 锁定版本 | 用户摘要、草稿、设置持久化；Token 与聊天正文不进入通用持久化 Store |
| 网络层 | 自封装 `request`（`uni.request` Promise 化 + 拦截器） | — | 见 6.2 |
| 类型契约 | **openapi-typescript** | — | 从后端 OpenAPI 生成 DTO；允许编写展示模型与转换器，禁止直接修改生成文件 |
| 实时通信 | 自封装 WS Client（`uni.connectSocket`） | — | 心跳/重连/分发，见 6.3 |
| 样式 | **SCSS + CSS 变量主题层** + rpx（750 基准） | — | 三级体系：Token → 组件变量 → 页面 |
| 工具库 | dayjs、`@uni-helper/uni-app-types`；lodash-es 按需评估 | — | 避免为少量工具函数引入不必要包体 |
| 规范 | ESLint + Prettier + Stylelint + husky + lint-staged + commitlint | — | Conventional Commits |
| 测试 | **Vitest** + Vue Test Utils | — | store / request / ws 重连逻辑单测 |
| Mock | OpenAPI 示例 + 本地 adapter / fixture | — | 保证 H5 与小程序测试使用同一批契约样例，不依赖只在 Vite Dev Server 生效的方案 |
| 埋点 | 自建 `track(event, props)` SDK，批量上报 | — | 漏斗见 PRD 第 6 节 |
| 包管理 | **pnpm** | ≥ 9 | |

---

## 3. 组件库总体策略：双轨制

原型图 8 张拆解后，组件分两类。占比仅表示设计投入估算，不作为验收指标：

| 类别 | 占比 | 来源 | 举例 |
| --- | --- | --- | --- |
| 地基件（无品牌感） | ~30% | **wot-design-uni 直接用**（注入手账风主题） | 弹窗、表单、Picker、骨架屏、无限滚动、Badge、上传 |
| 手账风件（品牌灵魂） | ~70% | **全部自研**，封装进 `@tago/ui` | 便签卡、三问作答卡、聊天气泡、礼物卡、礼物路书时间线 |

**为什么地基件不追求「长得像原型」再选库**：手账风注定要覆盖组件库默认皮肤，任何库的默认视觉都会被 Token 替换掉。所以地基件的选型标准只有三条：三端覆盖官方维护、主题注入能力、组件丰富度——wot-design-uni 三条全满足（对比 uview-plus 定制粒度粗、TuniaoUI 风格过重反而碍事、NutUI uni-app 版非官方主线）。

**主题注入方式**：品牌 Token 由 `tokens.scss` 统一定义；wot-design-uni 的变量名必须以实际安装版本的类型声明和文档为准，禁止凭示例猜字段。

```scss
// styles/tokens.scss —— 全项目唯一定义处
:root, page {
  --tago-primary: #1F4B3F;        // 墨绿（主按钮/导航）
  --tago-primary-weak: #2E6B58;
  --tago-paper: #F7F3E8;          // 米黄纸感底
  --tago-ink: #2B2B26;            // 正文墨色
  --tago-note-yellow: #FCE8B2;    // 便签黄
  --tago-note-blue: #D6E9F7;      // 便签蓝
  --tago-note-green: #DDEBD3;     // 便签绿
  --tago-sticker-shadow: 0 4px 14px rgba(31, 75, 63, .12);
  --tago-radius-card: 16rpx;
}
```

在根布局使用 `ConfigProvider`，同时调用其配套的 `useConfigProvider` 注入主题，覆盖小程序插槽隔离与 `root-portal` 场景；每次组件库升级都跑主题视觉回归。不要假设 `App.vue` 的模板能像普通 Web 根组件一样包住所有页面。

---

## 4. 自研手账风组件库（`@tago/ui`）——对照原型逐个定义

这是本选型的核心交付物，逐张对照原型图定义：

| 组件 | 对应原型 | 结构与实现要点 |
| --- | --- | --- |
| `TagCard` | 图 6 推荐流卡片 | 左侧头像/昵称/城市时间，中部 Tag 与摘要/标签，右侧主题插图；每张卡只渲染后端 `cta_type` 决定的一个主按钮（「想认识TA」或「看看TA」）；三色由稳定规则分配，禁止每次渲染随机变色或抖动 |
| `PinnedTagCard` | 图 6 置顶大卡 | 单独布局：用户信息 + Tag + 标签 + 三问摘要 + 右上价格标 + 一个主动作，不强行继承普通卡片 DOM；M1 商业化关闭时支持整体隐藏/运营样例态 |
| `MyTagBar` | 图 6 顶部 | 我当前的 Tag 条（墨绿实底、白字）+「切换 Tag →」；无 Tag 时空态引导 |
| `StickyNote` | 图 10/11 三问作答 | 单题作答卡：便签底色 + 胶带装饰 + 序号 + textarea（200 字计数）；发布页可整组换题，申请页不可换题；支持 `readonly` 展示态 |
| `QACompareBoard` | 图 12 双方回答对比 | 左右并排对照：左「我的回答」（蓝便签）/ 右「TA 的回答」（绿便签），中间 VS 手写体分隔；P0 还原精度要求最高的组件之一 |
| `ApplicationCard` | 图 8 申请卡片 | 「TA 想因为 #xx 认识你」+ 申请人简介 + Q1–Q3 完整回答 + 接受/拒绝按钮组；是否折叠由可用高度测试决定，不能默认隐藏影响决策的信息 |
| `ContextBanner` | 图 9 聊天顶部 | 头像对 + 「因为 #xx 而认识 · 第 N 天」；点击展开双方 Tag 与三问入口 |
| `ChatBubble` | 图 9 消息 | 我方墨绿底白字 / 对方纸白底墨字；圆角气泡 + 小尾巴；已读状态（送达灰 / 已读墨绿小字）；时间戳 5 分钟合并 |
| `GiftMessageCard` | 图 9 礼物消息 | emoji 图标 + 礼物名 + 一句寓意 + 描边卡片 + 「>」进详情；收发双方共用，方向镜像 |
| `AIHintToast` | 图 9 系统节点提示 | 居中窄条系统消息样式（🌙 昨天你们聊到了凌晨 2:17），非弹窗、不打断 |
| `GiftTimeline` | 图 13 礼物路书 | 路线层与内容层分离：路线使用分段图片或平台验证后的 SVG/canvas，礼物卡正常文档流左右交错；先做游标分页，数据量超过阈值再引入虚拟列表，避免可变高度卡片定位错误 |
| `HandwrittenText` | 全局点缀 | 经授权、子集化字体；微旋转由对象 ID 哈希生成稳定值，并在“减少动态效果”模式关闭；正文与表单不使用手写体 |
| `Sticker` | 全局 | 贴纸基座组件：PNG@2x/3x 或 SVG（H5）+ 投影；统一出口管理所有贴纸资源 |
| `EmptyState` | 各页空态 | 插画 + 引导按钮（如礼物墙「从这里出发 →」） |

**组件库工程纪律：**

- 颜色、字号、间距、圆角、阴影、动效时长统一引用 Token；与业务语义绑定的插图允许通过 props / asset map 指定；
- 每个组件提供 `props` 文档注释 + 基本单测（渲染 + 关键交互）；
- 禁用大面积 `filter`、多层 `backdrop-filter`、超长阴影链；纸纹和复杂阴影优先静态资源，并在微信真机与 Android 低端机验证；
- 贴纸资源统一 `static/stickers/` 管理，优先 WebP/PNG；SVG 只用于验证通过的平台和简单图形。资源生成脚本输入应是设计侧明确交付的 SVG/PNG，不假设可直接从原型截图自动导出；
- 组件不得把装饰图作为语义内容；按钮、状态与价格必须是真实文本，便于可访问性、埋点与自动化测试。

---

## 5. 视觉还原规范（设计 → 代码映射）

| 原型要素 | 实现方案 |
| --- | --- |
| 米黄纸感底色 | `--tago-paper` + 平铺噪声纹理 PNG（<20KB，`background-repeat`） |
| 深墨绿主色 | `--tago-primary`，注入 wot-design-uni ConfigProvider |
| 便签卡三色 | CSS 变量三色 + 基于业务 ID 的稳定色序与微旋转；刷新不跳变 |
| 胶带/贴纸装饰 | 设计输出 PNG 贴纸（带透明边）+ `Sticker` 组件；胶带用半透明黄 + 撕裂边 PNG |
| 手写体点缀 | 可商用字体并子集化；H5 优先 woff2，小程序/App 使用该端验证通过的字体加载方案并提供系统字体回退。仅用于标题/点缀，正文用系统字体 |
| 插图 | 设计输出 SVG/PNG/WebP 多规格源文件；构建按平台选择，列表缩略图不得直接加载 @3x 大图 |
| 微动效 | 便签按压回弹（`transition: transform .15s` + `scale(.97)`）、发布成功纸屑（轻量 CSS 动画，可选 lottie 单文件） |
| 适配 | rpx 750 基准；安全区 `env(safe-area-inset-*)`；H5 在 iPad/PC 居中 480px 容器 |
| 对比度校验 | 纸黄底 + 墨绿字需过 WCAG AA（正文 ≥ 14px）；黄/蓝/绿不能作为状态的唯一编码 |

---

## 6. 架构设计

### 6.1 目录结构

```
src/
├── api/
│   ├── types/            # openapi-typescript 生成（后端 Swagger）
│   ├── mappers/          # DTO → 页面 ViewModel，隔离空值/枚举/字段变更
│   ├── tag.ts  match.ts  chat.ts  gift.ts  user.ts  moderation.ts
│   └── client.ts         # request 封装
├── components/
│   ├── ui/               # wot-design-uni 二次封装出口（统一主题、按需）
│   └── business/         # @tago/ui：第 4 节全部手账风组件
├── composables/
│   ├── useTagFlow.ts     # 写Tag → AI三问 → 连接条件 → 发布 状态机
│   ├── useChat.ts  useConversationList.ts
│   ├── useGiftHint.ts  useGiftWall.ts
│   ├── useAsyncTask.ts  # AI 长耗时：骨架屏/15s超时/重试/取消
│   └── useAuth.ts       # ensureAuth() 游客拦截统一出口
├── stores/               # Pinia：user / chat / tag / settings；服务端数据按 ID 归一化
├── pages/
│   ├── discover/  tag/  meet/  chat/  gift/  mine/   # 与 PRD 3.2 页面地图一致
├── services/
│   ├── ws.ts             # WS 客户端
│   ├── payment/          # 支付统一接口 + h5/mp/app 平台实现
│   ├── auth/             # 登录统一接口 + 平台实现
│   └── storage.ts        # 草稿/设置/敏感信息分级存储
├── styles/               # tokens.scss / theme.scss / mixins.scss
├── utils/                # track.ts / guard.ts / storage.ts
└── static/               # fonts/ stickers/ textures/
```

### 6.2 网络层（`api/client.ts`）

- 拦截器注入 Token；401 自动刷新 + **并发请求排队重放**（防刷新风暴）；
- 业务错误码统一 Toast，`silent` 选项交页面接管；
- 生成的 DTO 不直接进入页面：经 mapper 归一化枚举、可空字段与时间格式；前端展示模型允许手写；
- 仅 GET/HEAD 等幂等读请求默认重试；发布 Tag、提交申请、发消息、创建订单必须携带幂等键，且不得因超时自动重复提交；
- 统一支持 `AbortController`/等价取消机制、超时分类、`request_id` 透传；业务错误映射为稳定 error code，Toast 文案由页面语境决定；
- Access Token 优先内存保存；必须持久化时使用平台安全能力并限制有效期。日志与错误上报对 Authorization、Cookie 和个人内容做脱敏。

### 6.3 WebSocket（`services/ws.ts`）

- `uni.connectSocket` 封装：带随机抖动的指数退避重连（1s→30s 封顶）、心跳参数由服务端下发或约定、按 `type` 分发（chat / application / gift_hint / system）；
- 以 REST 快照/增量接口为事实来源，WS 只提供低延迟通知。重连携带最近 `seq` 补拉缺口，应用回前台立即校准未读数；
- 消息以 `message_id` + `client_msg_id` 去重，以服务端 `seq` 排序；乐观更新状态为 sending → sent/failed，delivered/read 由服务端回执推进；
- 会话草稿按用户 + 会话隔离持久化；退出登录、注销或切换账号时清除。聊天正文默认不持久化到通用 Pinia 插件。

### 6.4 AI 流式/长耗时接口

- M1 默认三问一次性返回，统一走 `useAsyncTask`：骨架屏 / 超时 / 重试 / 取消；先减少跨端差异。
- 若实测 P95 时延超过产品阈值，再为 H5 评估 SSE；小程序/App 继续一次性返回。打字机仅是展示效果，不得伪装仍在生成或阻塞用户操作。
- 每次生成使用 `task_id`；迟到响应只有在页面仍处于同一任务且用户尚未编辑时才可落入表单，避免覆盖输入。

### 6.5 多端差异收敛（条件编译 `#ifdef`）

| 能力 | H5 | 微信小程序 | App |
| --- | --- | --- | --- |
| 登录 | 手机验证码 | 微信一键 + 手机号 | 验证码 / 微信 |
| 支付 | 按打开环境选择微信 JSAPI / H5 支付并提供不支持态 | `uni.requestPayment` | 方案须经应用商店政策与法务评审后确定 |
| 分享 | 复制链接 | `onShareAppMessage` | 系统分享 |
| 推送 | WS + 公众号模板消息 | 订阅消息 | UniPush（厂商通道） |
| 定位 | 浏览器授权，可拒绝并手选城市 | 小程序授权，可拒绝并手选城市 | 系统授权，可拒绝并手选城市；业务只保存城市级信息 |

### 6.6 导航、缓存与生命周期

- 底部采用自定义导航组件，页面路由仍由 `pages.json` 管理；中间“发 Tag”是动作路由，不占 Tab 历史。键盘弹出时隐藏底部导航，适配安全区。
- 发现流、申请列表与聊天列表使用游标分页。缓存 key 必须包含用户、筛选条件和版本；写操作成功后采用定点更新并后台再校准，不全局粗暴清缓存。
- H5 的刷新/返回、小程序 `onHide/onShow`、App 前后台切换都要进入验收矩阵；页面隐藏时取消非必要请求，恢复时按服务端时间刷新过期状态。

---

## 7. 工程化与质量

| 项 | 方案 |
| --- | --- |
| CI/CD | Git 流水线：lint → type-check → 单测 → `pnpm build:h5` / `pnpm build:mp-weixin`；小程序体验版上传与 App 打包使用对应平台工具，证书与密钥只放 CI Secret |
| 环境 | dev / staging / prod 三套 `.env`，域名与 WS 地址按环境注入 |
| 性能预算 | 以 PRD 的用户体验指标为主；CI 记录各入口 JS/CSS/图片体积并设回归阈值。小程序主包与分包上限读取发布时官方规则，不把临时平台数字写死为长期架构事实 |
| 监控 | 埋点 SDK 批量上报 + 全局错误捕获；屏蔽 Token、手机号和 UGC 正文；source map 私有上传 |
| 测试优先级 | 状态机/幂等/乱序（tag、application、chat、payment）> request/ws > 关键组件交互 > H5 E2E > 微信开发者工具与真机冒烟 |
| 发布门禁 | OpenAPI breaking change 检查、生成文件无手改、H5 Lighthouse/等价指标、微信真机关键链路、错误率与埋点校验 |

**脚手架快速启动：**

```bash
# 1. 初始化（CLI 工程，日常不依赖 HBuilderX）
npx degit dcloudio/uni-preset-vue#vite-ts tago-app
cd tago-app && pnpm i

# 2. 接入组件库与基建
pnpm add wot-design-uni pinia pinia-plugin-persistedstate dayjs
pnpm add -D sass @uni-helper/uni-app-types eslint prettier stylelint vitest @vue/test-utils openapi-typescript

# 3. 三端构建
pnpm dev:h5          # H5 开发
pnpm build:h5        # H5 产物
pnpm dev:mp-weixin   # 微信小程序
pnpm build:app       # App 阶段（配合 HBuilderX 云打包出 apk/ipa）
```

---

## 8. 实施路线

| 阶段 | 周期 | 内容 | 关键点 |
| --- | --- | --- | --- |
| W1 | 1 周 | 脚手架 + Token + 主题注入 + API 生成/mapper + request/store 基建 + TagCard/StickyNote | 先完成 H5/微信真机技术 Spike：自定义底栏、字体、纸纹、长列表、WS |
| W2–3 | 2 周 | M1 核心链路：登录 → 发 Tag → 发现流 → 回应三问 → 认识申请（含状态机与 QACompareBoard） | 明确换题、CTA、审核、拒绝/过期口径；AI 默认一次性返回 |
| W4–5 | 2 周 | 聊天全链路（WS 通知 + REST 补拉 + ContextBanner + AI 节点提示）+ 我的/设置 + 举报拉黑/注销 + 埋点 → **H5 内测** | 弱网、乱序、多端并发、键盘遮挡与账号切换专项 |
| W6–7 | 2 周 | M2 礼物链路（提示 → 生成 → 支付 → 聊天卡）+ GiftTimeline 礼物路书 + 图片消息；**微信小程序适配发布** | 小程序审核预留 1 周；支付走通 |
| W8+ | — | 商业化（Tag Spotlight 竞拍）+ App 打包（UniPush/支付/分享补齐）→ 双商店上架 | iOS IAP 合规评估 |

---

## 9. 风险与缓解

| 风险 | 等级 | 缓解 |
| --- | --- | --- |
| App 端 WebView 页面性能（聊天长列表） | 高 | M1 建真实消息量基准；先分页、减少重排和图片尺寸，再评估虚拟列表。若需要 nvue/uni-app x，视为独立技术项目，不承诺“局部无痛重写” |
| 手账风阴影/贴纸在小程序低端机渲染 | 中 | 首周真机 Spike；阴影烘焙进切图、资源分辨率分级、动效降级开关 |
| H5 微信内登录/支付与 App 虚拟礼物合规 | 高 | 登录在 M1 前完成域名/账号资质验证；商业化在 M2 前完成渠道、退款、应用商店与法务评审 |
| AI 接口时延不可控 | 中 | 统一骨架屏、取消/重试、任务 ID 与超时降级；根据 H5 实测 P95 再评估 SSE |
| 手写字体授权 | 低 | 确认可商用（站酷快乐体/仓耳系等），woff2 子集化控制体积 |
| “一套代码四端”预期过高 | 中 | 定义复用目标而非像素级承诺；保留 `services/*` 平台实现与端专属资源，按端验收 |

---

## 10. 技术决策门禁（进入开发前）

满足以下条件后，本文选型才从“评审定稿”转为“执行基线”：

1. 使用实际后端 OpenAPI 生成一次类型并通过编译，确认鉴权、分页、错误码、幂等键、`request_id` 和时间字段。
2. H5 微信内置浏览器 + 微信小程序真机完成 Spike：自定义底栏、wot 主题、手写字体、纸纹/贴纸、长列表与 WebSocket 前后台恢复。
3. 用 500 条会话、2,000 条消息、100 条礼物卡的脱敏模拟数据测量内存、滚动和首屏，记录基线再决定是否虚拟化。
4. 产品/设计关闭 PRD 8.1 的未决项；测试按 PRD 状态表生成用例，而不是只按静态页面截图验收。

### 官方依据（核验日期：2026-09-15）

- [uni-app Vue3/Vite TypeScript CLI 模板](https://uniapp.dcloud.net.cn/quickstart-cli)
- [uni-app CLI 与 HBuilderX CLI / App 打包边界](https://uniapp.dcloud.net.cn/worktile/CLI.html)
- [uni-app Vue3 跨端语法差异](https://uniapp.dcloud.net.cn/tutorial/vue3-basics)
- [uni-app CSS 与小程序本地背景图限制](https://uniapp.dcloud.net.cn/tutorial/syntax-css)
- [Wot UI ConfigProvider 跨小程序注入说明](https://v1.wot-ui.cn/component/use-config-provider)

---

## 11. 一句话总结

> **uni-app + Vue3 + TypeScript + Vite 作为共享主线，wot-design-uni 只提供基础件，便签、三问、气泡、礼物卡和礼物路书进入自研业务组件层；通过平台 adapter、状态机、幂等与真机门禁换取可控复用，不承诺零差异的一套代码。**

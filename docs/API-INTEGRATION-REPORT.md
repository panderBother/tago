# TAGO API 接入与实测报告

测试日期：2026-09-16  
Swagger 契约：`1.0.0-rc.2`  
契约操作数：46  
前端 Base URL：`http://47.106.168.39/api`

## 实测结论

- 已从 Swagger 重新生成 `src/api/types/generated.ts`，46 个操作全部纳入类型和入口审计。
- 对 46 个操作使用原始 HTTP 方法进行了入口测试，全部返回 `308 Permanent Redirect`。
- 所有响应都重定向到 `https://47.106.168.39/api/...`。
- HTTPS 目标在 TLS 握手阶段返回 `internal error`，因此请求无法到达 CSRF、登录或业务控制器。
- 5 个测试账号分别请求登录入口，全部返回 `308`；阻断发生在 CSRF/凭证校验之前，并非账号或密码错误。
- Swagger 文档站自己的发布元数据为 `deploymentStatus: UNVERIFIED`，与本次真实请求结果一致。

## 当前不可用范围

由于 Base URL 的 HTTPS/SNI 配置问题，当前 46 个操作全部无法从 H5 调用：

- 身份与资料：14 个操作
- 聊天：7 个操作
- Tag、发现与申请：17 个操作
- 曝光：6 个操作
- 钱包：2 个操作

以上合计为 Swagger 的 46 个 operationId。

## 文档标记为 IMPLEMENTED_WITH_GAPS 的 12 个操作

这些接口即使部署入口修复，仍需要重点做 Dev/集成证据验证：

1. `GET /v1/applications`
2. `GET /v1/applications/{applicationId}`
3. `POST /v1/applications/{applicationId}/accept`
4. `POST /v1/applications/{applicationId}/reject`
5. `GET /v1/chats/{conversationId}/encounters`
6. `GET /v1/chats/{conversationId}/encounters/{encounterId}`
7. `GET /v1/exposure`
8. `GET /v1/exposure/bids`
9. `POST /v1/exposure/bids`
10. `GET /v1/exposure/bids/{bidId}`
11. `GET /v1/exposure/carousel`
12. `GET /v1/exposure/rules`

其余 34 个操作在契约中标记为 `IMPLEMENTED_UNVERIFIED`，不是已完成真实环境验证。

## 前端已完成的接入

- 统一请求封装：Base URL、查询参数、Cookie 会话、CSRF、CSRF 失效重试、幂等键、统一错误模型。
- 领域 API：身份、公共资料、Tag、发现、认识申请、聊天、曝光、钱包。
- 首页、相遇页、申请页已改为数据驱动；接口不可用时保留原型数据，接口恢复后自动替换成真实数据。
- 发布 Tag 已串联草稿创建/修改、问题生成、发布者答案和发布流程。
- 回应 Tag 已串联公开 Tag 读取和认识申请提交。

## 后端需要修复

请选择其一：

1. 提供带有效域名和证书的 HTTPS API Base URL；或
2. 暂时关闭 `47.106.168.39` 的 HTTP→HTTPS 跳转；或
3. 为该 IP 配置可用的 TLS 默认证书/SNI 路由。

修复后运行：

```bash
pnpm api:audit
```

随后即可继续执行账号登录、CSRF、Cookie 会话和业务状态链路的真实数据复测。

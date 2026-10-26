# AGENTS 指南（Artive Help）

本文件面向在本仓库中协作的工程师与自动化代理（如编程助理）。目标是：在不引入不必要复杂度的前提下，快速、稳定地完成变更。

## 1) 技术栈概览
- 框架: Next.js 15（App Router） + React 19
- 语言: TypeScript（严格模式）
- UI: Tailwind CSS 4、Radix UI
- 编辑器: Tiptap
- 数据: Supabase（SSR 客户端）
- LLM: OpenRouter（流式改写）

## 2) 目录与约定
- 源码目录: `src/`
  - 页面与路由: `src/app`
  - API 路由: `src/app/api/**`
- 别名: `@/*` -> `src/*`（见 `tsconfig.json`）
- 配置文件：`eslint.config.mjs`、`.prettierrc.json`、`.editorconfig`

## 3) 开发与运行
- 开发：`npm run dev`（端口 8080）
- 构建：`npm run build`
- 生产：`npm start`
- Lint：`npm run lint`

Node 版本建议 >= 18。

## 4) 环境变量
在项目根目录创建 `.env.local`（可参考 `env.local.example`）：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（仅服务端使用）
- `OPENROUTER_API_KEY`（LLM 改写）
- `NEXT_PUBLIC_APP_URL`（如本地 `http://localhost:3000` 或部署地址）

注意：不要在浏览器可见的代码中泄露服务端密钥（如 Service Role）。

## 5) 代码规范
- ESLint：基于 Next 官方规则（`next/core-web-vitals` + `next/typescript`），在本项目中：
  - `src/` 下允许 `console`，便于调试。
  - `src/app/api/` 下允许 `console` 与 `eval`（用于解析不规范 LLM 输出的兜底策略）。
- Prettier：2 空格、单引号、分号、100 列宽、结尾逗号。
- EditorConfig：LF、UTF-8、去行尾空白、2 空格缩进。

规范命令：
- 仅格式化：`npx prettier . --write`
- 仅检查：`npm run lint`

## 6) API（SSE/流式）开发要点
项目中存在基于 SSE 的流式改写路由（例如 `src/app/api/rewrite/stream/route.ts`）。关键约定：
- 使用 `ReadableStream` 与 `controller.enqueue(...)` 推送数据；结束时 `controller.close()`。
- 返回值使用 `new Response(readableStream, { headers: { 'Content-Type': 'text/event-stream', ... } })`。
- 事件采用 `data: <JSON>\n\n` 行为单位推送，常见类型：
  - `start`、`status`、`progress`、`content`、`complete`、`error`。

示例（节选）：

```ts
const encoder = new TextEncoder();
const readableStream = new ReadableStream({
  async start(controller) {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`));
    try {
      // ...处理
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
    } catch (e) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error' })}\n\n`));
    } finally {
      controller.close();
    }
  },
});
return new Response(readableStream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  },
});
```

避免：在流式路由中使用未定义的 `writer/stream`；不要在函数末尾遗留 `})();` 这类 IIFE 残片。

## 7) Supabase 使用约定
- SSR 环境使用 `@supabase/ssr` 的 `createServerClient`。
- API 路由内若需要服务端权限，可使用 `SUPABASE_SERVICE_ROLE_KEY`（或回退到 anon key），并确保 cookie 对象存在（可使用空实现 `getAll()/setAll()`）。
- 客户端与服务端的密钥严格区分，避免将 Service Role 下发到浏览器。

## 8) AI/LLM 相关
- 使用 OpenRouter：`https://openrouter.ai/api/v1/chat/completions`，Header 需带 `Authorization: Bearer <key>`，并设置 `stream: true`。
- 提示词要求 LLM 仅返回 `{title, content}` 的 JSON；对于非规范 JSON，路由里存在多重兜底解析策略（包括正则与 `eval`）。
- 解析逻辑要注意：
  - 流式增量解析时先累积 `content` 片段。
  - 完成后先尝试 `JSON.parse`，失败再做“选取 JSON 子串 + 转义校正”，最终再兜底。

## 9) 质量检查与验证
- 本地快速验证：
  - 构建：`npm run build`
  - Lint：`npm run lint`
  - 格式化：`npx prettier . --write`
- 若新增 API 路由，优先保证构建通过与开发环境可流式响应。

## 10) 变更范围与提交建议
- 以“最小、聚焦”为原则，避免修改与当前任务无关的代码。
- 遵循现有风格与工具链，不随意切换技术选型。
- 不新增版权/许可证头（除非任务明确要求）。
- 如需批量重构或引入依赖，请先与维护者同步评估影响。

## 11) 常见问题排查
- 构建期语法错误：常见于 API 路由流式实现，确认未使用未定义对象（如 `writer/stream`），并正确返回 `readableStream`。
- 环境变量缺失：检查 `.env.local` 是否齐全，且生产环境配置了必要的 Secrets。
- LLM 响应解析失败：查看服务端日志，必要时放宽兜底策略，但需记录原因与示例，避免误吞真实错误。

用中文回复我，不要用英文

如需进一步自动化（lint-staged/husky、CI 等），请在提交前与维护者确认，我可以据此扩展本指南与脚本。

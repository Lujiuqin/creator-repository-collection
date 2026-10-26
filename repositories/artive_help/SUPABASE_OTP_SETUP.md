# Supabase OTP 验证码配置指南

## 问题说明
当前邮件发送的是 Magic Link（登录链接）而不是 OTP 验证码，需要在 Supabase 控制台修改邮件模板。

## 配置步骤

### 1. 登录 Supabase 控制台
- 访问 https://supabase.com/dashboard
- 选择你的项目

### 2. 修改邮件模板
1. 进入 **Authentication** → **Email Templates**
2. 找到 **Confirm signup** 或 **Magic Link** 模板
3. 将模板内容修改为 OTP 格式：

#### 原始模板（Magic Link）：
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

#### 修改为 OTP 模板：
```html
<h2>您的登录验证码</h2>
<p>您好！</p>
<p>您的登录验证码是：</p>
<h1 style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px;">{{ .Token }}</h1>
<p>此验证码将在 10 分钟后过期。</p>
<p>如果您没有请求此验证码，请忽略此邮件。</p>
```

### 3. 配置 Auth 设置
1. 进入 **Authentication** → **Providers** → **Email**
2. 确保以下设置：
   - **Enable Email Provider**: ✅ 启用
   - **Confirm email**: ✅ 启用（如果需要邮箱验证）
   - **Enable email OTP**: ✅ 启用（重要！）

### 4. 高级设置（可选）
在 **Authentication** → **Settings** 中：
- **Enable Magic Link**: ❌ 禁用
- **OTP Expiry**: 600（10分钟）
- **Max OTP Attempts**: 5（最多尝试5次）

## 验证配置

### 测试步骤：
1. 在应用中点击"发送登录验证码"
2. 检查邮件，应该收到包含 6 位数字的验证码
3. 在应用中输入验证码
4. 成功登录

### 如果仍然收到链接：
1. 清除浏览器缓存
2. 检查是否有多个邮件模板需要修改
3. 确认 Supabase 项目的 URL 和 Anon Key 配置正确

## 注意事项
- 修改邮件模板后，新的设置会立即生效
- 如果同时需要支持 Magic Link 和 OTP，可以创建不同的邮件模板
- 确保 `.env.local` 文件中的 Supabase 配置正确

## 相关代码位置
- 前端验证码发送逻辑：`src/components/auth/AuthModal.tsx`
- Supabase 客户端配置：`src/lib/supabase/client.ts`
- 环境变量配置：`.env.local`
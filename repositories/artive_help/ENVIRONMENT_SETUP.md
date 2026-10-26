# 环境变量配置说明

## 📋 配置步骤

### 1. 复制环境变量模板文件
```bash
# 将模板文件复制为实际配置文件
cp .env.local.example .env.local
```

### 2. 编辑 `.env.local` 文件，填入真实配置值

## 🔑 必需的环境变量

### Supabase 配置
```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

**获取方式：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制 Project URL 和 anon public 密钥

### 大家啦API密钥
```env
DAJIALA_API_KEY=你的大家啦API密钥
```

**获取方式：**
1. 访问 [大家啦官网](https://www.dajiala.com)
2. 注册账号并购买API服务
3. 在API管理页面获取密钥

## 🚨 重要提示

1. **`.env.local` 文件已添加到 `.gitignore`**，不会被提交到代码仓库
2. **不要将密钥硬编码到代码中**
3. **生产环境请使用不同的密钥**

## 🧪 测试配置

启动项目后，如果环境变量配置错误，会看到以下错误信息：
- `服务配置错误，请联系管理员配置DAJIALA_API_KEY`

## 📝 可选配置

```env
# 开发环境标识
NODE_ENV=development

# 应用基础URL（用于回调等）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 故障排除

1. **密钥不生效**：重启开发服务器 `npm run dev`
2. **Supabase连接失败**：检查URL和密钥是否正确
3. **API调用失败**：检查大家啦密钥余额是否充足
# 改写功能调试指南

## 问题修复总结

### 1. 已修复的问题

#### URL传递问题
- ✅ 素材库API正确返回`original_url`字段
- ✅ 素材卡片上添加了"查看原文"链接
- ✅ 添加了调试日志来追踪URL传递

#### 改写任务执行问题
- ✅ 非微信链接现在不会导致任务失败，而是使用标题进行改写
- ✅ 任务失败时状态会正确更新为`failed`
- ✅ 添加了更详细的错误日志

#### JSON解析问题
- ✅ 优化了AI提示词，确保返回有效JSON
- ✅ 增强了JSON解析逻辑，支持从文本中提取JSON
- ✅ 添加了兜底处理机制

## 调试工具

### 1. 调试API端点
访问 `/api/debug` 查看：
- 素材库内容及URL状态
- 改写任务状态
- 环境变量配置状态

### 2. SQL调试脚本
执行 `debug_rewrite.sql` 可以：
- 查看素材库中的URL状态
- 查看失败的改写任务
- 手动更新任务状态
- 添加测试数据

### 3. 控制台日志
后台会输出以下关键信息：
- 素材库数据（包含URL）
- 改写任务处理过程
- URL验证结果
- AI调用状态

## 使用流程

### 1. 配置环境变量
```bash
# .env.local
OPENROUTER_API_KEY=你的OpenRouter密钥
JIZHILE_API_KEY=你的极致了密钥（可选，用于获取微信文章）
SUPABASE_SERVICE_ROLE_KEY=你的Service Role密钥（可选，提高权限）
```

### 2. 执行数据库脚本
在Supabase SQL编辑器中执行：
1. `create_rewrite_tables.sql` - 创建必要的表
2. `fix_rewrite_rls.sql` - 修复RLS策略

### 3. 测试改写功能
1. 在素材库页面选择素材
2. 点击"批量改写"
3. 选择AI模型（Claude/GPT/Gemini）
4. 跳转到改写页面查看进度

## 处理逻辑

### URL处理策略
1. **有微信链接**：调用极致了API获取原文内容
2. **有非微信链接**：使用标题和链接信息生成基础内容
3. **无链接**：使用标题作为内容进行改写

### 任务状态
- `pending`：等待处理
- `processing`：正在处理
- `completed`：处理成功
- `failed`：处理失败（查看error_message）

## 常见问题

### Q: 为什么任务一直在"改写中"？
A: 检查以下几点：
1. 后台控制台是否有错误日志
2. 环境变量是否正确配置
3. 使用调试API查看任务状态

### Q: 为什么提示"素材不是微信公众号文章"？
A: 现在已修复，非微信链接也会进行改写，只是使用标题作为内容。

### Q: 如何添加测试数据？
A: 在`debug_rewrite.sql`中有示例SQL，可以：
1. 更新现有内容的URL
2. 插入新的测试内容

## 监控建议

1. **定期检查失败任务**
```sql
SELECT * FROM rewrite_tasks 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

2. **查看素材URL状态**
```sql
SELECT title, original_url, 
  CASE WHEN original_url LIKE '%mp.weixin.qq.com%' 
  THEN '微信' ELSE '其他' END as type
FROM contents 
WHERE id IN (SELECT content_id FROM user_materials);
```

3. **API使用情况**
- OpenRouter API调用次数和费用
- 极致了API余额（如果使用）
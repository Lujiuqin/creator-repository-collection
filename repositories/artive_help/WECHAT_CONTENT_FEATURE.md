# 微信公众号内容获取功能说明

## 功能概述

本项目新增了微信公众号内容获取功能，用户可以：
1. 订阅微信公众号
2. 自动获取公众号历史文章（最近5页内容）
3. 手动刷新获取最新文章
4. 查看文章列表和详细信息
5. 直接跳转到微信文章原文

## 功能特性

### 🔍 智能去重
- 基于文章URL进行去重
- 避免重复存储相同文章
- 支持增量更新

### ⚡ 刷新限制
- 手动刷新间隔：5分钟
- 防止频繁调用第三方API
- 友好的倒计时提示

### 📊 内容展示
- 文章封面图片
- 标题和发布时间
- 阅读量和位置信息
- 按时间倒序排列

### 🎯 用户体验
- 订阅时自动获取历史内容
- 实时进度显示
- 加载状态反馈
- 分页浏览支持

## 使用步骤

### 1. 配置API密钥
在 `.env.local` 文件中添加微信API配置：
```bash
# 微信公众号内容获取API配置
WECHAT_API_KEY=您的微信API密钥
WECHAT_API_BASE_URL=https://wxapi3.2yk.cn/tools/dwd
```

### 2. 更新数据库
执行数据库更新脚本：
```sql
-- 在Supabase SQL编辑器中执行
-- 文件：add_content_features.sql
```

### 3. 订阅公众号
1. 访问灵感集市页面
2. 在搜索框中输入公众号名称
3. 点击"搜索"按钮
4. 选择公众号并点击"订阅"
5. 系统自动开始获取历史内容

### 4. 查看内容
1. 在订阅列表下方选择要查看的公众号
2. 系统显示该公众号的文章列表
3. 点击文章卡片可跳转到原文
4. 使用分页控制查看更多内容

### 5. 刷新内容
1. 点击订阅项右侧的"获取最新"按钮
2. 等待内容获取完成
3. 查看新增文章数量提示

## 技术实现

### 数据库结构
```sql
-- user_subscriptions表新增字段
ALTER TABLE user_subscriptions ADD COLUMN last_content_fetch_at TIMESTAMP;
ALTER TABLE user_subscriptions ADD COLUMN content_fetch_count INTEGER DEFAULT 0;

-- contents表新增字段
ALTER TABLE contents ADD COLUMN original_url TEXT;
ALTER TABLE contents ADD COLUMN cover_image_url TEXT;
ALTER TABLE contents ADD COLUMN position INTEGER;
ALTER TABLE contents ADD COLUMN send_to_fans_num INTEGER;
ALTER TABLE contents ADD COLUMN external_id TEXT;
```

### API接口
- `POST /api/wechat/content` - 获取微信内容
- `GET /api/wechat/content` - 查询内容列表

### 核心组件
- `SubscriptionManager` - 订阅管理（已更新）
- `ContentList` - 内容列表展示（新增）
- `InspirationMarket` - 主页面集成（已更新）

## 注意事项

### API限制
- 第三方微信API可能有调用频率限制
- 建议合理控制获取频率
- 监控API返回状态码

### 数据存储
- 内容存储在统一的contents表中
- 支持多平台内容（微信、YouTube）
- 自动维护内容索引

### 性能考虑
- 分页加载避免大量数据传输
- 图片懒加载优化页面性能
- 缓存机制减少重复请求

## 错误处理

### 常见问题
1. **API密钥未配置**
   - 检查 `.env.local` 文件
   - 确认WECHAT_API_KEY已设置

2. **获取内容失败**
   - 检查网络连接
   - 确认API服务可用
   - 查看控制台错误日志

3. **5分钟限制提示**
   - 等待剩余时间后重试
   - 这是正常的防护机制

4. **数据库字段缺失**
   - 执行 `add_content_features.sql` 脚本
   - 检查字段是否正确添加

## 扩展功能

### 未来计划
- [ ] YouTube频道内容获取
- [ ] 内容关键词标记
- [ ] 文章内容摘要提取
- [ ] 批量导入素材库
- [ ] 内容推荐算法

### 自定义配置
- 修改获取页数限制（当前5页）
- 调整刷新时间间隔（当前5分钟）
- 自定义内容过滤规则

## 开发者指南

### 添加新平台支持
1. 扩展Platform类型定义
2. 创建平台专用API接口
3. 实现内容获取逻辑
4. 更新前端组件支持

### 自定义内容处理
1. 修改内容存储格式
2. 添加内容预处理逻辑
3. 实现自定义展示样式
4. 集成AI内容分析

## 支持

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 查看开发文档
- 联系技术支持

---

*最后更新：2024年*
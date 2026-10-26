-- ============================================
-- 创建改写功能相关数据库表
-- ============================================

-- 1. 创建改写任务表
CREATE TABLE IF NOT EXISTS rewrite_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  
  -- 任务配置
  ai_model VARCHAR(100) NOT NULL, -- 使用的AI模型：claude-3-5-sonnet-20241022、gpt-4o、gemini-pro-1.5-latest
  prompt_template TEXT NOT NULL, -- 使用的提示词模板
  
  -- 任务状态
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending、processing、completed、failed
  error_message TEXT, -- 错误信息（如果失败）
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  started_at TIMESTAMP WITH TIME ZONE, -- 开始处理时间
  completed_at TIMESTAMP WITH TIME ZONE, -- 完成时间
  
  -- 索引
  CONSTRAINT rewrite_tasks_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- 2. 创建改写结果表
CREATE TABLE IF NOT EXISTS rewrite_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES rewrite_tasks(id) ON DELETE CASCADE,
  
  -- 版本管理
  version INTEGER NOT NULL DEFAULT 1, -- 改写版本号
  title TEXT NOT NULL, -- 改写后的标题
  
  -- 内容
  content_html TEXT NOT NULL, -- 改写后的HTML内容
  content_text TEXT, -- 纯文本内容（用于搜索）
  
  -- 编辑状态
  is_edited BOOLEAN DEFAULT false, -- 是否被用户编辑过
  edited_content_html TEXT, -- 编辑后的内容
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- 确保每个任务的版本号唯一
  UNIQUE(task_id, version)
);

-- 3. 创建提示词模板表（系统预设）
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL, -- 模板名称
  description TEXT, -- 模板描述
  prompt_text TEXT NOT NULL, -- 提示词内容
  
  -- 分类和状态
  category VARCHAR(100), -- 分类：爆款模仿、风格改写、内容优化等
  is_active BOOLEAN DEFAULT true, -- 是否启用
  is_system BOOLEAN DEFAULT true, -- 是否系统预设
  
  -- 使用统计
  usage_count INTEGER DEFAULT 0, -- 使用次数
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. 创建素材原文缓存表（避免重复调用外部API）
CREATE TABLE IF NOT EXISTS content_originals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  
  -- 原文内容
  original_title TEXT NOT NULL, -- 原始标题
  original_html TEXT NOT NULL, -- 原始HTML内容
  original_author VARCHAR(255), -- 原作者
  
  -- 来源信息
  source_url TEXT, -- 原文链接
  fetch_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()), -- 获取时间
  
  -- 缓存有效期（7天后自动清理）
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW() + INTERVAL '7 days'),
  
  UNIQUE(content_id)
);

-- 5. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_rewrite_tasks_user_status 
ON rewrite_tasks(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rewrite_tasks_content 
ON rewrite_tasks(content_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rewrite_results_task 
ON rewrite_results(task_id, version DESC);

CREATE INDEX IF NOT EXISTS idx_content_originals_expires 
ON content_originals(expires_at);

-- 6. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为rewrite_results表添加触发器
CREATE TRIGGER update_rewrite_results_updated_at 
BEFORE UPDATE ON rewrite_results
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为prompt_templates表添加触发器
CREATE TRIGGER update_prompt_templates_updated_at 
BEFORE UPDATE ON prompt_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 设置RLS策略
ALTER TABLE rewrite_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewrite_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_originals ENABLE ROW LEVEL SECURITY;

-- rewrite_tasks策略
CREATE POLICY "Users can view own rewrite tasks" ON rewrite_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rewrite tasks" ON rewrite_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewrite tasks" ON rewrite_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- rewrite_results策略
CREATE POLICY "Users can view own rewrite results" ON rewrite_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rewrite_tasks 
      WHERE rewrite_tasks.id = rewrite_results.task_id 
      AND rewrite_tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own rewrite results" ON rewrite_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rewrite_tasks 
      WHERE rewrite_tasks.id = rewrite_results.task_id 
      AND rewrite_tasks.user_id = auth.uid()
    )
  );

-- prompt_templates策略（所有人可读）
CREATE POLICY "Everyone can view active templates" ON prompt_templates
  FOR SELECT USING (is_active = true);

-- content_originals策略（所有认证用户可用）
CREATE POLICY "Authenticated users can view originals" ON content_originals
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert originals" ON content_originals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8. 插入默认提示词模板
INSERT INTO prompt_templates (name, description, prompt_text, category, is_system) VALUES
(
  '爆款文章模仿',
  '分析文章的结构和爆款元素，然后进行模仿',
  '请仔细分析这篇文章的以下要素：
1. 标题策略：分析标题的吸引力元素（数字、对比、悬念、利益点等）
2. 开头技巧：如何在前3句话内抓住读者注意力
3. 内容结构：文章的逻辑框架和段落布局
4. 情绪调动：使用了哪些情绪触发点（好奇、焦虑、共鸣、期待等）
5. 金句提炼：找出文中的精彩句子和观点
6. 结尾设计：如何引导读者互动或行动

基于以上分析，请用相同的技巧和结构，重新创作这篇文章。要求：
- 保持原文的核心信息和观点
- 使用更生动、更有吸引力的表达方式
- 加入当下流行的网络用语和表达（适度使用）
- 确保文章节奏紧凑，每段不超过3-4句话
- 标题要有强烈的点击欲望

原文如下：
{{content}}',
  '爆款模仿',
  true
),
(
  '口语化改写',
  '将文章改写成更口语化、更易读的风格',
  '请将这篇文章改写成口语化的风格，要求：
1. 把书面语改成日常对话用语
2. 长句改短句，复杂句改简单句
3. 专业术语用通俗的解释替代
4. 加入一些口语化的连接词（比如"你知道吗"、"说真的"、"其实吧"等）
5. 保持原文的信息完整性

原文如下：
{{content}}',
  '风格改写',
  true
),
(
  '精简优化',
  '保留核心内容，去除冗余信息',
  '请精简这篇文章，要求：
1. 删除所有冗余和重复的内容
2. 保留核心观点和关键信息
3. 每个段落只表达一个主要观点
4. 使用简洁有力的表达
5. 总字数控制在原文的60-70%

原文如下：
{{content}}',
  '内容优化',
  true
);

-- 9. 创建清理过期缓存的函数
CREATE OR REPLACE FUNCTION clean_expired_originals() RETURNS void AS $$
BEGIN
  DELETE FROM content_originals WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. 输出创建结果
SELECT 
  'Tables created successfully' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rewrite_tasks', 'rewrite_results', 'prompt_templates', 'content_originals');
-- ============================================
-- 添加内容获取和刷新限制功能
-- 此脚本为现有表添加必要的字段
-- ============================================

-- 1. 为user_subscriptions表添加最后刷新时间字段（用于5分钟刷新限制）
DO $$ 
BEGIN
  -- 检查last_content_fetch_at列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'last_content_fetch_at'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN last_content_fetch_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- 检查content_fetch_count列（记录内容获取次数）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'content_fetch_count'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN content_fetch_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. 为contents表添加必要字段（如果还没有）
DO $$ 
BEGIN
  -- 检查original_url列（原始文章链接）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'original_url'
  ) THEN
    ALTER TABLE contents ADD COLUMN original_url TEXT;
  END IF;
  
  -- 检查cover_image_url列（封面图片）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE contents ADD COLUMN cover_image_url TEXT;
  END IF;
  
  -- 检查position列（文章在推送中的位置）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'position'
  ) THEN
    ALTER TABLE contents ADD COLUMN position INTEGER;
  END IF;
  
  -- 检查send_to_fans_num列（推送粉丝数）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'send_to_fans_num'
  ) THEN
    ALTER TABLE contents ADD COLUMN send_to_fans_num INTEGER;
  END IF;
  
  -- 检查external_id列（外部平台ID，如appmsgid）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'external_id'
  ) THEN
    ALTER TABLE contents ADD COLUMN external_id TEXT;
  END IF;
END $$;

-- 3. 创建唯一约束确保内容不重复
DO $$ 
BEGIN
  -- 为contents表创建唯一约束（基于original_url）
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contents_original_url_unique'
  ) THEN
    ALTER TABLE contents 
    ADD CONSTRAINT contents_original_url_unique 
    UNIQUE(original_url);
  END IF;
END $$;

-- 4. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_last_fetch 
ON user_subscriptions(user_id, last_content_fetch_at);

CREATE INDEX IF NOT EXISTS idx_contents_external_id 
ON contents(external_id);

CREATE INDEX IF NOT EXISTS idx_contents_source_published 
ON contents(source_type, source_id, published_at DESC);

-- 5. 验证更新结果
SELECT 
  'Content features added successfully' as status,
  COUNT(*) as updated_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_subscriptions', 'contents');

-- 显示新增字段
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('user_subscriptions', 'contents')
AND column_name IN (
  'last_content_fetch_at', 
  'content_fetch_count', 
  'original_url', 
  'cover_image_url', 
  'position', 
  'send_to_fans_num', 
  'external_id'
)
ORDER BY table_name, column_name;
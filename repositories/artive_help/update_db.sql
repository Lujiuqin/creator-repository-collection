-- ============================================
-- 增量更新数据库脚本
-- 此脚本会检查并只添加缺失的元素
-- ============================================

-- 1. 创建更新时间触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. 为各表添加触发器（如果不存在）
-- wechat_accounts表
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_wechat_accounts_updated_at'
  ) THEN
    CREATE TRIGGER update_wechat_accounts_updated_at 
    BEFORE UPDATE ON wechat_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- youtube_channels表
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_youtube_channels_updated_at'
  ) THEN
    CREATE TRIGGER update_youtube_channels_updated_at 
    BEFORE UPDATE ON youtube_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- contents表
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_contents_updated_at'
  ) THEN
    CREATE TRIGGER update_contents_updated_at 
    BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 3. 创建索引（如果不存在）
-- user_subscriptions索引
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_type_id 
ON user_subscriptions(subscription_type, subscription_id);

-- contents索引
CREATE INDEX IF NOT EXISTS idx_contents_source 
ON contents(source_type, source_id, published_at DESC);

-- content_texts索引
CREATE INDEX IF NOT EXISTS idx_content_texts_content 
ON content_texts(content_id, text_type, language, version DESC);

-- 4. 启用RLS（如果尚未启用）
ALTER TABLE wechat_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_texts ENABLE ROW LEVEL SECURITY;

-- 5. 创建RLS策略（先删除旧的，再创建新的）
-- wechat_accounts表策略
DROP POLICY IF EXISTS "Public wechat_accounts are viewable by everyone" ON wechat_accounts;
CREATE POLICY "Public wechat_accounts are viewable by everyone" ON wechat_accounts
  FOR SELECT USING (true);

-- 允许认证用户插入新的公众号记录
DROP POLICY IF EXISTS "Authenticated users can insert wechat_accounts" ON wechat_accounts;
CREATE POLICY "Authenticated users can insert wechat_accounts" ON wechat_accounts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 允许认证用户更新公众号信息（比如头像、描述等）
DROP POLICY IF EXISTS "Authenticated users can update wechat_accounts" ON wechat_accounts;
CREATE POLICY "Authenticated users can update wechat_accounts" ON wechat_accounts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- user_subscriptions表策略
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can delete own subscriptions" ON user_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- contents表策略
DROP POLICY IF EXISTS "Contents are viewable by everyone" ON contents;
CREATE POLICY "Contents are viewable by everyone" ON contents
  FOR SELECT USING (true);

-- 允许认证用户插入contents（修复接口可读不可写的问题）
DROP POLICY IF EXISTS "Authenticated users can insert contents" ON contents;
CREATE POLICY "Authenticated users can insert contents" ON contents
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- content_texts表策略
DROP POLICY IF EXISTS "Content texts are viewable by everyone" ON content_texts;
CREATE POLICY "Content texts are viewable by everyone" ON content_texts
  FOR SELECT USING (true);

-- 6. 检查并添加可能缺失的列（安全地添加）
-- 检查wechat_accounts表是否有所有必需的列
DO $$ 
BEGIN
  -- 检查verified列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wechat_accounts' AND column_name = 'verified'
  ) THEN
    ALTER TABLE wechat_accounts ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
  
  -- 检查updated_at列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wechat_accounts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE wechat_accounts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
  END IF;
END $$;

-- 检查user_subscriptions表的is_active列
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- 检查content_texts表的version列
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_texts' AND column_name = 'version'
  ) THEN
    ALTER TABLE content_texts ADD COLUMN version INTEGER DEFAULT 1;
  END IF;
  
  -- 检查ai_model列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_texts' AND column_name = 'ai_model'
  ) THEN
    ALTER TABLE content_texts ADD COLUMN ai_model VARCHAR(100);
  END IF;
END $$;

-- 7. 确保唯一约束存在
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_subscriptions_unique_subscription'
  ) THEN
    ALTER TABLE user_subscriptions 
    ADD CONSTRAINT user_subscriptions_unique_subscription 
    UNIQUE(user_id, subscription_type, subscription_id);
  END IF;
END $$;

-- 8. 验证脚本执行结果
SELECT 
  'Tables created/updated successfully' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('wechat_accounts', 'youtube_channels', 'user_subscriptions', 'contents', 'content_texts');

-- 显示各表的记录数
SELECT 'wechat_accounts' as table_name, COUNT(*) as record_count FROM wechat_accounts
UNION ALL
SELECT 'user_subscriptions', COUNT(*) FROM user_subscriptions
UNION ALL
SELECT 'contents', COUNT(*) FROM contents
UNION ALL
SELECT 'content_texts', COUNT(*) FROM content_texts
UNION ALL
SELECT 'youtube_channels', COUNT(*) FROM youtube_channels
ORDER BY table_name;
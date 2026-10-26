-- 检查现有表结构的SQL语句
-- 请在Supabase SQL编辑器中执行以下语句，查看表结构

-- 1. 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. 查看wechat_accounts表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'wechat_accounts'
ORDER BY ordinal_position;

-- 3. 查看user_subscriptions表结构  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- 4. 查看contents表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'contents'
ORDER BY ordinal_position;

-- 5. 查看content_texts表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'content_texts'
ORDER BY ordinal_position;

-- 6. 查看youtube_channels表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'youtube_channels'
ORDER BY ordinal_position;

-- 7. 查看现有的索引
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('wechat_accounts', 'user_subscriptions', 'contents', 'content_texts', 'youtube_channels')
ORDER BY tablename, indexname;

-- 8. 查看现有的RLS策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('wechat_accounts', 'user_subscriptions', 'contents', 'content_texts', 'youtube_channels')
ORDER BY tablename, policyname;
-- ============================================
-- 测试改写功能的数据准备
-- ============================================

-- 1. 查看现有的内容和URL
SELECT 
  c.id,
  c.title,
  c.original_url,
  c.source_type,
  c.created_at
FROM contents c
ORDER BY c.created_at DESC
LIMIT 10;

-- 2. 检查素材库中的内容
SELECT 
  um.content_id,
  c.title,
  c.original_url,
  um.collected_at
FROM user_materials um
JOIN contents c ON c.id = um.content_id
WHERE um.user_id = auth.uid()
ORDER BY um.collected_at DESC;

-- 3. 更新没有URL的内容（测试用）
-- 如果你的素材库中有内容但没有URL，可以手动添加一个微信文章URL
-- 例如：
-- UPDATE contents 
-- SET original_url = 'https://mp.weixin.qq.com/s/你的文章ID'
-- WHERE id = '你的内容ID' 
-- AND original_url IS NULL;

-- 4. 插入一个测试内容（如果需要）
-- 注意：替换为实际的微信文章URL
/*
INSERT INTO contents (
  id,
  title,
  source_type,
  original_url,
  published_at
) VALUES (
  gen_random_uuid(),
  '测试文章 - 如何提升公众号阅读量',
  'wechat',
  'https://mp.weixin.qq.com/s/XXXXX', -- 替换为实际的微信文章URL
  NOW()
);

-- 将测试内容加入素材库
INSERT INTO user_materials (
  user_id,
  content_id,
  collected_at
) 
SELECT 
  auth.uid(),
  id,
  NOW()
FROM contents
WHERE title = '测试文章 - 如何提升公众号阅读量';
*/

-- 5. 查看改写任务状态
SELECT 
  rt.id,
  rt.content_id,
  c.title,
  rt.ai_model,
  rt.status,
  rt.error_message,
  rt.created_at,
  rt.completed_at
FROM rewrite_tasks rt
JOIN contents c ON c.id = rt.content_id
WHERE rt.user_id = auth.uid()
ORDER BY rt.created_at DESC
LIMIT 10;

-- 6. 查看改写结果
SELECT 
  rr.id,
  rr.task_id,
  rr.version,
  rr.title,
  LEFT(rr.content_html, 100) as content_preview,
  rr.created_at
FROM rewrite_results rr
JOIN rewrite_tasks rt ON rt.id = rr.task_id
WHERE rt.user_id = auth.uid()
ORDER BY rr.created_at DESC
LIMIT 10;
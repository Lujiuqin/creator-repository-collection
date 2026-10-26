-- ============================================
-- 调试改写功能问题
-- ============================================

-- 1. 查看素材库中的内容，特别是URL字段
SELECT 
  c.id,
  c.title,
  c.original_url,
  c.source_type,
  CASE 
    WHEN c.original_url LIKE '%mp.weixin.qq.com%' THEN '是微信链接'
    WHEN c.original_url IS NULL THEN '无URL'
    ELSE '非微信链接'
  END as url_type,
  um.collected_at
FROM user_materials um
JOIN contents c ON c.id = um.content_id
WHERE um.user_id = auth.uid()
ORDER BY um.collected_at DESC
LIMIT 10;

-- 2. 查看失败的改写任务
SELECT 
  rt.id as task_id,
  rt.content_id,
  c.title,
  c.original_url,
  rt.ai_model,
  rt.status,
  rt.error_message,
  rt.created_at,
  rt.started_at,
  rt.completed_at
FROM rewrite_tasks rt
LEFT JOIN contents c ON c.id = rt.content_id
WHERE rt.user_id = auth.uid()
AND rt.status = 'failed'
ORDER BY rt.created_at DESC
LIMIT 10;

-- 3. 手动更新失败任务为pending（重试）
-- UPDATE rewrite_tasks 
-- SET status = 'pending', 
--     error_message = NULL,
--     started_at = NULL,
--     completed_at = NULL
-- WHERE id = '你的任务ID'
-- AND user_id = auth.uid();

-- 4. 添加测试用的微信链接到现有内容
-- 如果你的素材没有original_url或不是微信链接，可以手动更新
-- 注意：请使用真实的微信文章链接
-- UPDATE contents 
-- SET original_url = 'https://mp.weixin.qq.com/s/XXX'  -- 替换为真实链接
-- WHERE id = '5513434c-cf73-48a3-9279-e36227a680dc'  -- 替换为你的内容ID
-- AND (original_url IS NULL OR original_url NOT LIKE '%mp.weixin.qq.com%');

-- 5. 查看所有改写任务的统计
SELECT 
  status,
  COUNT(*) as count,
  MAX(created_at) as latest_created,
  MAX(completed_at) as latest_completed
FROM rewrite_tasks
WHERE user_id = auth.uid()
GROUP BY status
ORDER BY status;

-- 6. 创建一个辅助函数来手动更新任务状态（绕过RLS）
CREATE OR REPLACE FUNCTION update_rewrite_task_status(
  p_task_id UUID,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE rewrite_tasks
  SET 
    status = p_status,
    error_message = p_error_message,
    completed_at = CASE 
      WHEN p_status IN ('completed', 'failed') THEN NOW() 
      ELSE completed_at 
    END
  WHERE id = p_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 使用示例：
-- SELECT update_rewrite_task_status('任务ID', 'failed', '测试错误信息');
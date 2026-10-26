-- ============================================
-- 修复改写功能RLS策略
-- ============================================

-- 1. 删除现有的rewrite_results策略
DROP POLICY IF EXISTS "Users can view own rewrite results" ON rewrite_results;
DROP POLICY IF EXISTS "Users can update own rewrite results" ON rewrite_results;

-- 2. 创建新的策略（允许认证用户插入）
CREATE POLICY "Users can view own rewrite results" ON rewrite_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rewrite_tasks 
      WHERE rewrite_tasks.id = rewrite_results.task_id 
      AND rewrite_tasks.user_id = auth.uid()
    )
  );

-- 允许认证用户插入（通过任务关联）
CREATE POLICY "Service can insert rewrite results" ON rewrite_results
  FOR INSERT WITH CHECK (
    -- 允许服务端插入（当没有用户ID时）
    auth.uid() IS NULL 
    OR
    -- 或者任务属于当前用户
    EXISTS (
      SELECT 1 FROM rewrite_tasks 
      WHERE rewrite_tasks.id = rewrite_results.task_id 
      AND rewrite_tasks.user_id = auth.uid()
    )
  );

-- 允许用户更新自己的改写结果
CREATE POLICY "Users can update own rewrite results" ON rewrite_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rewrite_tasks 
      WHERE rewrite_tasks.id = rewrite_results.task_id 
      AND rewrite_tasks.user_id = auth.uid()
    )
  );

-- 3. 确保rewrite_tasks的策略也正确
DROP POLICY IF EXISTS "Users can update own rewrite tasks" ON rewrite_tasks;

CREATE POLICY "Users can update own rewrite tasks" ON rewrite_tasks
  FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() IS NULL  -- 允许服务端更新
  );

-- 4. 验证策略
SELECT 
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('rewrite_tasks', 'rewrite_results')
ORDER BY tablename, policyname;
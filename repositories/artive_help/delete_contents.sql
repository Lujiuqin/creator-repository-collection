-- 删除 contents 表和相关表中的所有数据
-- 注意：这个操作是不可逆的，请确保在生产环境执行前先备份数据

-- 方法1：使用 TRUNCATE CASCADE（推荐 - 会同时删除所有相关表数据）
TRUNCATE TABLE contents CASCADE;

-- 方法2：分别删除相关表（如果你想更精确控制）
-- DELETE FROM content_texts;  -- 先删除子表
-- DELETE FROM contents;       -- 再删除主表

-- 方法3：使用 DELETE（较慢但可以回滚）
-- DELETE FROM content_texts;
-- DELETE FROM contents;

-- 执行后检查表是否为空
SELECT 
    'contents' as table_name, 
    COUNT(*) as remaining_records 
FROM contents
UNION ALL
SELECT 
    'content_texts' as table_name, 
    COUNT(*) as remaining_records 
FROM content_texts;

-- 可选：查看表的结构和外键关系
-- \d contents
-- \d content_texts
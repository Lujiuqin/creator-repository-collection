-- 更新 contents 表结构，添加去重和新内容获取所需的字段

-- 检查并添加缺失的列
DO $$ 
BEGIN
  -- 检查 external_id 列（用于存储第三方API的唯一ID，如appmsgid）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'external_id'
  ) THEN
    ALTER TABLE contents ADD COLUMN external_id VARCHAR(255);
    -- 为external_id添加索引，用于快速去重查询
    CREATE INDEX idx_contents_external_id ON contents(source_type, source_id, external_id);
  END IF;
  
  -- 检查 is_original 列（标记是否为原创内容）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'is_original'
  ) THEN
    ALTER TABLE contents ADD COLUMN is_original BOOLEAN DEFAULT false;
  END IF;
  
  -- 检查 position 列（在多篇文章发布中的位置，如头条、二条等）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'position'
  ) THEN
    ALTER TABLE contents ADD COLUMN position INTEGER DEFAULT 1;
  END IF;
  
  -- 检查 send_to_fans_num 列（推送到的粉丝数量）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'send_to_fans_num'
  ) THEN
    ALTER TABLE contents ADD COLUMN send_to_fans_num INTEGER DEFAULT 0;
  END IF;
  
  -- 检查 metadata 列（存储额外的元数据，如API特有字段）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contents' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE contents ADD COLUMN metadata JSONB;
    -- 为metadata添加GIN索引，支持JSON查询
    CREATE INDEX idx_contents_metadata ON contents USING GIN (metadata);
  END IF;
END $$;

-- 更新现有记录的默认值（如果需要）
UPDATE contents SET 
  is_original = false 
WHERE is_original IS NULL;

UPDATE contents SET 
  position = 1 
WHERE position IS NULL;

UPDATE contents SET 
  send_to_fans_num = 0 
WHERE send_to_fans_num IS NULL;

-- 验证更新结果
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contents' 
AND column_name IN ('external_id', 'is_original', 'position', 'send_to_fans_num', 'metadata')
ORDER BY column_name;

-- 显示更新后的表结构信息
SELECT 
  'Contents table updated successfully' as status,
  COUNT(*) as total_records
FROM contents;
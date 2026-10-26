-- ============================================
-- Create user_materials table for personal material library
-- Safe re-runnable: guards IF NOT EXISTS for table/index/policies/triggers
-- Execute this in Supabase SQL editor
-- ============================================

-- 1) Create table (composite primary key, avoid uuid extension dependency)
CREATE TABLE IF NOT EXISTS user_materials (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, content_id)
);

-- 2) Enable RLS
ALTER TABLE user_materials ENABLE ROW LEVEL SECURITY;

-- 3) RLS policies (idempotent: drop old names if they exist first)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_materials' AND policyname = 'Users can view own materials') THEN
    DROP POLICY "Users can view own materials" ON user_materials;
  END IF;
  CREATE POLICY "Users can view own materials" ON user_materials
    FOR SELECT USING (auth.uid() = user_id);

  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_materials' AND policyname = 'Users can insert own materials') THEN
    DROP POLICY "Users can insert own materials" ON user_materials;
  END IF;
  CREATE POLICY "Users can insert own materials" ON user_materials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_materials' AND policyname = 'Users can delete own materials') THEN
    DROP POLICY "Users can delete own materials" ON user_materials;
  END IF;
  CREATE POLICY "Users can delete own materials" ON user_materials
    FOR DELETE USING (auth.uid() = user_id);

  -- Optional: allow user to update own rows (e.g., change collected_at)
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_materials' AND policyname = 'Users can update own materials') THEN
    DROP POLICY "Users can update own materials" ON user_materials;
  END IF;
  CREATE POLICY "Users can update own materials" ON user_materials
    FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- 4) Useful indexes (besides PK)
CREATE INDEX IF NOT EXISTS idx_user_materials_user_collected_at
  ON user_materials(user_id, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_materials_content_id
  ON user_materials(content_id);

-- 5) updated_at trigger (reuse global function if present)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_materials_updated_at'
  ) THEN
    CREATE TRIGGER update_user_materials_updated_at
    BEFORE UPDATE ON user_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 6) Quick validation
SELECT 'user_materials' AS table_name, COUNT(*) AS record_count FROM user_materials;
SELECT
  column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_materials'
ORDER BY ordinal_position;



/**
 * SQL Schema definitions for IZHAR OS Portfolio Database.
 */

export const SCHEMA_SQL = `
-- 1. System Profile Table
CREATE TABLE IF NOT EXISTS system_profile (
  id text PRIMARY KEY,
  name text NOT NULL,
  wordmark text NOT NULL,
  role text NOT NULL,
  disciplines jsonb NOT NULL DEFAULT '[]'::jsonb,
  location text NOT NULL,
  tagline text NOT NULL,
  statement text NOT NULL,
  experience text NOT NULL,
  status jsonb NOT NULL DEFAULT '{}'::jsonb,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 2. About Profile Table
CREATE TABLE IF NOT EXISTS about_profile (
  id text PRIMARY KEY,
  positioning text NOT NULL,
  introduction jsonb NOT NULL DEFAULT '[]'::jsonb,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  journey jsonb NOT NULL DEFAULT '[]'::jsonb,
  build_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 3. Skill Categories Table
CREATE TABLE IF NOT EXISTS skill_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text,
  description text,
  icon text,
  accent text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  category_id text REFERENCES skill_categories(id) ON DELETE SET NULL,
  level text,
  experience text,
  description text,
  primary_skill boolean DEFAULT false,
  icon text,
  proficiency int DEFAULT 80,
  projects jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Project Categories Table
CREATE TABLE IF NOT EXISTS project_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text,
  description text,
  icon text,
  accent text,
  count int DEFAULT 0,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_description text,
  description text,
  category_id text REFERENCES project_categories(id) ON DELETE SET NULL,
  category_name text,
  technologies jsonb DEFAULT '[]'::jsonb,
  role text,
  duration text,
  status text,
  featured boolean DEFAULT false,
  accent text,
  icon text,
  overview jsonb DEFAULT '[]'::jsonb,
  problem text,
  solution text,
  my_contribution jsonb DEFAULT '[]'::jsonb,
  highlights jsonb DEFAULT '[]'::jsonb,
  challenges jsonb DEFAULT '[]'::jsonb,
  architecture jsonb,
  stats jsonb,
  links jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 7. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id text PRIMARY KEY,
  role text NOT NULL,
  company text NOT NULL,
  location text,
  period text,
  duration text,
  is_current boolean DEFAULT false,
  description text,
  achievements jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 8. Resume Data Table
CREATE TABLE IF NOT EXISTS resume_data (
  id text PRIMARY KEY,
  summary text NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb,
  education jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  stack_groups jsonb DEFAULT '[]'::jsonb,
  download_url text,
  updated_at timestamptz DEFAULT now()
);

-- 9. Contact Config Table
CREATE TABLE IF NOT EXISTS contact_config (
  id text PRIMARY KEY,
  email text NOT NULL,
  location text NOT NULL,
  timezone text NOT NULL,
  availability jsonb NOT NULL DEFAULT '{}'::jsonb,
  channels jsonb NOT NULL DEFAULT '[]'::jsonb,
  topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 10. Contact Messages Table (Live Inbox)
CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- 11. System Settings / Metadata Table
CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) and Public Read Policies
ALTER TABLE system_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read on portfolio content
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Profile' AND tablename = 'system_profile') THEN
    CREATE POLICY "Public Read Profile" ON system_profile FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read About' AND tablename = 'about_profile') THEN
    CREATE POLICY "Public Read About" ON about_profile FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Skill Categories' AND tablename = 'skill_categories') THEN
    CREATE POLICY "Public Read Skill Categories" ON skill_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Skills' AND tablename = 'skills') THEN
    CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Project Categories' AND tablename = 'project_categories') THEN
    CREATE POLICY "Public Read Project Categories" ON project_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Projects' AND tablename = 'projects') THEN
    CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Experiences' AND tablename = 'experiences') THEN
    CREATE POLICY "Public Read Experiences" ON experiences FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Resume' AND tablename = 'resume_data') THEN
    CREATE POLICY "Public Read Resume" ON resume_data FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Contact Config' AND tablename = 'contact_config') THEN
    CREATE POLICY "Public Read Contact Config" ON contact_config FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Contact Messages' AND tablename = 'contact_messages') THEN
    CREATE POLICY "Public Insert Contact Messages" ON contact_messages FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read System Settings' AND tablename = 'system_settings') THEN
    CREATE POLICY "Public Read System Settings" ON system_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
`;

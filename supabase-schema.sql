-- ====================================
-- OVERBRAND - Supabase Database Schema
-- ====================================
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- TABLE: quotes (Demandes de devis)
-- ====================================
CREATE TABLE IF NOT EXISTS quotes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  services    TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  budget      TEXT,
  deadline    DATE,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  admin_notes TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================
-- TABLE: projects (Projets clients)
-- ====================================
CREATE TABLE IF NOT EXISTS projects (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quote_id    UUID REFERENCES quotes(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'not_started'
              CHECK (status IN ('not_started', 'in_progress', 'review', 'completed')),
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date  DATE,
  deadline    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================
-- TABLE: project_updates (Mises à jour)
-- ====================================
CREATE TABLE IF NOT EXISTS project_updates (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on all tables
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Quotes: users can only see their own quotes
CREATE POLICY "Users can view own quotes" ON quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes" ON quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects: users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Project updates: users can see updates for their own projects
CREATE POLICY "Users can view updates for own projects" ON project_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- ====================================
-- AUTO-UPDATE updated_at
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====================================
-- SAMPLE DATA (optionnel)
-- ====================================
-- Vous pouvez décommenter ceci pour tester avec un utilisateur existant:
-- INSERT INTO quotes (user_id, services, description, budget, status)
-- VALUES ('votre-user-id', ARRAY['website', 'seo'], 'Création site vitrine + SEO', '1 000 000 – 3 000 000 FCFA', 'accepted');

-- ====================================
-- OVERBRAND - Supabase Database Schema
-- ====================================
-- Run this in your Supabase SQL Editor
-- Ce fichier est idempotent : peut être relancé plusieurs fois sans erreur

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- TABLE: profiles (Rôles utilisateurs)
-- ====================================
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role       TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Fonction SECURITY DEFINER pour éviter la récursion RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- Trigger: crée automatiquement un profil 'client' à chaque inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role) VALUES (NEW.id, 'client')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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
-- TABLE: showcase_projects (Projets vitrine homepage)
-- ====================================
CREATE TABLE IF NOT EXISTS showcase_projects (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT NOT NULL,
  category       TEXT NOT NULL,
  description    TEXT,
  gradient       TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #0d2240 0%, #3a6fd8 100%)',
  accent         TEXT NOT NULL DEFAULT '#3a6fd8',
  size           TEXT NOT NULL DEFAULT 'medium' CHECK (size IN ('large', 'medium', 'small')),
  display_order  INTEGER NOT NULL DEFAULT 0,
  visible        BOOLEAN NOT NULL DEFAULT true,
  image_url      TEXT,
  image_position TEXT DEFAULT 'center',
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ajouter les colonnes si la table existe déjà (idempotent)
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS image_url      TEXT;
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_projects ENABLE ROW LEVEL SECURITY;

-- Quotes
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
CREATE POLICY "Users can view own quotes" ON quotes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
CREATE POLICY "Admins can view all quotes" ON quotes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
CREATE POLICY "Users can insert own quotes" ON quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update quotes" ON quotes;
CREATE POLICY "Admins can update quotes" ON quotes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
CREATE POLICY "Admins can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update projects" ON projects;
CREATE POLICY "Admins can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
CREATE POLICY "Admins can delete projects" ON projects
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Project updates
DROP POLICY IF EXISTS "Users can view updates for own projects" ON project_updates;
CREATE POLICY "Users can view updates for own projects" ON project_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
        AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all project updates" ON project_updates;
CREATE POLICY "Admins can view all project updates" ON project_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert project updates" ON project_updates;
CREATE POLICY "Admins can insert project updates" ON project_updates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete project updates" ON project_updates;
CREATE POLICY "Admins can delete project updates" ON project_updates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Showcase projects
DROP POLICY IF EXISTS "Anyone can view visible showcase projects" ON showcase_projects;
CREATE POLICY "Anyone can view visible showcase projects" ON showcase_projects
  FOR SELECT USING (visible = true);

DROP POLICY IF EXISTS "Admins can manage showcase projects" ON showcase_projects;
CREATE POLICY "Admins can manage showcase projects" ON showcase_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
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

DROP TRIGGER IF EXISTS quotes_updated_at ON quotes;
CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====================================
-- STORAGE BUCKET: media
-- ====================================
-- Créer le bucket (lecture publique, upload réservé aux admins)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Upload réservé aux admins
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND public.is_admin()
  );

-- Suppression réservée aux admins
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND public.is_admin()
  );

-- ====================================
-- TABLE: team_members (Équipe)
-- ====================================
CREATE TABLE IF NOT EXISTS team_members (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name           TEXT NOT NULL,
  role           TEXT NOT NULL,
  bio            TEXT,
  photo_url      TEXT,
  photo_position TEXT DEFAULT 'center',
  tag            TEXT,
  linkedin_url   TEXT,
  twitter_url    TEXT,
  website_url    TEXT,
  display_order  INTEGER NOT NULL DEFAULT 0,
  visible        BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible team members" ON team_members;
CREATE POLICY "Anyone can view visible team members" ON team_members
  FOR SELECT USING (visible = true);

DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (public.is_admin());

-- ====================================
-- SE DÉFINIR COMME ADMIN
-- ====================================
-- Remplace 'VOTRE-UUID' par votre UUID (Authentication > Users dans Supabase)
-- INSERT INTO profiles (id, role) VALUES ('VOTRE-UUID', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ====================================
-- CRÉER UN PROFIL POUR LES UTILISATEURS EXISTANTS
-- ====================================
-- Si tu avais déjà des comptes avant ce schéma, exécute ceci :
-- INSERT INTO profiles (id, role)
-- SELECT id, 'client' FROM auth.users
-- ON CONFLICT (id) DO NOTHING;

-- ====================================
-- PROJETS VITRINE INITIAUX (exemples)
-- ====================================
-- Décommentez pour pré-remplir :
-- INSERT INTO showcase_projects (title, category, description, gradient, accent, size, display_order) VALUES
--   ('Identité Marque Luxe', 'Branding', 'Refonte complète de l''identité visuelle pour une maison de mode.', 'linear-gradient(135deg, #0d2240 0%, #2855a0 50%, #3a6fd8 100%)', '#3a6fd8', 'large', 1),
--   ('Plateforme E-Commerce', 'Site Web', 'Boutique en ligne avec tunnel de vente optimisé.', 'linear-gradient(135deg, #1a3a6b 0%, #6b9fd4 100%)', '#6b9fd4', 'small', 2),
--   ('App Mobile Fintech', 'Application', 'Interface utilisateur pour une startup de paiement mobile.', 'linear-gradient(160deg, #2855a0 0%, #0d2240 100%)', '#2855a0', 'small', 3),
--   ('Campagne SEO & Ads', 'Marketing', 'Stratégie 360° qui a triplé le trafic organique en 3 mois.', 'linear-gradient(135deg, #3a6fd8 0%, #1a3a6b 100%)', '#3a6fd8', 'medium', 4),
--   ('Motion Design Brand', 'Contenu', 'Série de vidéos animées pour lancement de produit.', 'linear-gradient(135deg, #6b9fd4 0%, #0d2240 100%)', '#6b9fd4', 'medium', 5);

-- ====================================
-- COLONNE image_url sur showcase_projects
-- ====================================
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE showcase_projects ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_position TEXT DEFAULT 'center top';

-- ====================================
-- STORAGE BUCKET: media
-- ====================================
-- À exécuter dans le SQL Editor Supabase :
-- 1. Créer le bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique : admins peuvent uploader
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Politique : admins peuvent supprimer
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Lecture publique
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- ====================================
-- TABLE: team_members (Équipe OverBrand)
-- ====================================
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  bio           TEXT,
  photo_url     TEXT,
  tag           TEXT,
  linkedin_url  TEXT,
  twitter_url   TEXT,
  website_url   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible team members" ON team_members;
CREATE POLICY "Anyone can view visible team members" ON team_members
  FOR SELECT USING (visible = true);

DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ====================================
-- TABLE: contacts (Messages du formulaire de contact)
-- ====================================
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  company    TEXT,
  message    TEXT NOT NULL,
  budget     TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage contacts" ON contacts;
CREATE POLICY "Admins can manage contacts" ON contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
